// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::env;
use std::process::Command;
use std::path::PathBuf;
use std::fs;
use serde::Serialize;
use winreg::enums::*;
use winreg::RegKey;
use reqwest::Client;

#[derive(Serialize)]
struct JavaInfo {
    path: String,
    version: String,
    arch: String,
}

#[tauri::command]
fn get_username() -> String {
    match env::var("USERNAME") {
        Ok(username) => username,
        Err(_) => String::from("Username")
    }
}

fn check_registry_java() -> Vec<String> {
    let mut java_paths = Vec::new();
    
    // 检查 JDK 注册表
    let jdk_keys = [
        r"SOFTWARE\JavaSoft\Java Development Kit",
        r"SOFTWARE\JavaSoft\JDK",
    ];
    
    // 检查 JRE 注册表
    let jre_keys = [
        r"SOFTWARE\JavaSoft\Java Runtime Environment",
        r"SOFTWARE\JavaSoft\JRE",
    ];
    
    let hklm = RegKey::predef(HKEY_LOCAL_MACHINE);
    
    // 检查 64 位注册表
    for key_path in jdk_keys.iter().chain(jre_keys.iter()) {
        if let Ok(key) = hklm.open_subkey(key_path) {
            if let Ok(names) = key.enum_keys().collect::<Result<Vec<_>, _>>() {
                for name in names {
                    if let Ok(ver_key) = key.open_subkey(&name) {
                        if let Ok(java_home) = ver_key.get_value::<String, _>("JavaHome") {
                            let java_path = PathBuf::from(&java_home).join("bin").join("java.exe");
                            if java_path.exists() {
                                java_paths.push(java_path.to_string_lossy().into_owned());
                            }
                        }
                    }
                }
            }
        }
    }
    
    // 检查 32 位注册表
    if let Ok(key) = hklm.open_subkey_with_flags(r"SOFTWARE\WOW6432Node\JavaSoft", KEY_READ) {
        if let Ok(names) = key.enum_keys().collect::<Result<Vec<_>, _>>() {
            for name in names {
                if let Ok(subkey) = key.open_subkey(&name) {
                    if let Ok(ver_names) = subkey.enum_keys().collect::<Result<Vec<_>, _>>() {
                        for ver_name in ver_names {
                            if let Ok(ver_key) = subkey.open_subkey(&ver_name) {
                                if let Ok(java_home) = ver_key.get_value::<String, _>("JavaHome") {
                                    let java_path = PathBuf::from(&java_home).join("bin").join("java.exe");
                                    if java_path.exists() {
                                        java_paths.push(java_path.to_string_lossy().into_owned());
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    
    java_paths
}

#[tauri::command]
async fn select_java_path() -> Result<JavaInfo, String> {
    use tauri::api::dialog::blocking::FileDialogBuilder;
    
    // 打开文件选择对话框
    let file_path = FileDialogBuilder::new()
        .set_title("选择 javaw.exe")
        .add_filter("Javaw 可执行文件", &["exe"])
        .set_file_name("javaw.exe")
        .set_directory(r"C:\Program Files\Java")  // 默认打开 Java 安装目录
        .pick_file()
        .ok_or("未选择文件".to_string())?;

    // 验证选择的是否为 javaw.exe
    let file_name = file_path.file_name()
        .ok_or("无法获取文件名")?
        .to_string_lossy()
        .to_lowercase();

    if file_name != "javaw.exe" {
        return Err("请选择 javaw.exe 文件".to_string());
    }

    // 获取对应的 java.exe 路径（与 javaw.exe 在同一目录）
    let dir = file_path.parent()
        .ok_or("无法获取文件目录")?;
    let java_exe = dir.join("java.exe");

    if !java_exe.exists() {
        return Err("所选目录中未找到对应的 java.exe".to_string());
    }

    // 验证 Java 版本
    if let Some(mut java_info) = get_java_info_from_path(&java_exe) {
        // 将路径替换为 javaw.exe
        java_info.path = file_path.to_string_lossy().into_owned();
        Ok(java_info)
    } else {
        Err("无法获取 Java 版本信息，请确保选择了有效的 Java 安装".to_string())
    }
}

#[tauri::command]
async fn select_java_folder() -> Result<JavaInfo, String> {
    use tauri::api::dialog::blocking::FileDialogBuilder;
    
    // 打开文件夹选择对话框
    let folder_path = FileDialogBuilder::new()
        .set_title("选择 Java 安装目录")
        .set_directory(r"C:\Program Files\Java")  // 默认打开 Java 安装目录
        .pick_folder()
        .ok_or("未选择目录".to_string())?;

    // 查找 javaw.exe
    let javaw_path = folder_path.join("bin").join("javaw.exe");
    if !javaw_path.exists() {
        return Err("所选目录中未找到 javaw.exe，请确保选择了正确的 Java 安装目录".to_string());
    }

    // 查找对应的 java.exe
    let java_exe = folder_path.join("bin").join("java.exe");
    if !java_exe.exists() {
        return Err("所选目录中未找到 java.exe".to_string());
    }

    // 验证 Java 版本
    if let Some(mut java_info) = get_java_info_from_path(&java_exe) {
        // 使用 javaw.exe 的路径
        java_info.path = javaw_path.to_string_lossy().into_owned();
        Ok(java_info)
    } else {
        Err("无法获取 Java 版本信息，请确保选择了有效的 Java 安装目录".to_string())
    }
}

#[tauri::command]
fn detect_java_installations() -> Vec<JavaInfo> {
    println!("开始检测 Java 安装...");
    let mut java_list = Vec::new();
    
    // 首先检查默认的 Java 安装路径
    let default_path = PathBuf::from(r"C:\Program Files\Java");
    println!("检查默认路径: {:?}", default_path);
    if default_path.exists() {
        println!("默认路径存在，开始检查...");
        check_directory_for_java(&default_path, &mut java_list);
    } else {
        println!("默认路径不存在");
    }
    
    // 如果在默认路径没有找到 Java，再检查其他路径
    if java_list.is_empty() {
        println!("在默认路径未找到 Java，检查其他路径...");
        // 检查其他常见的 Java 安装路径
        let paths = vec![
            r"C:\Program Files (x86)\Java",
            r"C:\Program Files\Eclipse Adoptium",
            r"C:\Program Files\Eclipse Foundation",
            r"C:\Program Files\Microsoft\jdk",
            r"C:\Program Files\BellSoft\LibericaJDK",
            r"C:\Program Files\AdoptOpenJDK",
            r"C:\Program Files\Zulu",
            r"C:\Program Files\Common Files\Oracle\Java",
        ];

        for path in paths {
            if let Ok(entries) = fs::read_dir(path) {
                for entry in entries.flatten() {
                    let path = entry.path();
                    if path.is_dir() {
                        check_directory_for_java(&path, &mut java_list);
                    }
                }
            }
        }

        // 检查用户目录下的 Java 安装
        if let Ok(username) = env::var("USERNAME") {
            let user_paths = vec![
                format!(r"C:\Users\{}\AppData\Local\Programs\Java", username),
                format!(r"C:\Users\{}\AppData\Local\Programs\Eclipse Adoptium", username),
                format!(r"C:\Users\{}\AppData\Local\Programs\Eclipse Foundation", username),
                format!(r"C:\Users\{}\AppData\Local\Programs\Microsoft\jdk", username),
                format!(r"C:\Users\{}\AppData\Local\Programs\AdoptOpenJDK", username),
                format!(r"C:\Users\{}\AppData\Local\Programs\Zulu", username),
                format!(r"C:\Users\{}\.jdks", username),
            ];

            for path in user_paths {
                if let Ok(entries) = fs::read_dir(&path) {
                    for entry in entries.flatten() {
                        let path = entry.path();
                        if path.is_dir() {
                            check_directory_for_java(&path, &mut java_list);
                        }
                    }
                }
            }
        }

        // 检查注册表
        let registry_paths = check_registry_java();
        for java_path in registry_paths {
            let java_exe = PathBuf::from(&java_path);
            if java_exe.exists() {
                if let Some(java_info) = get_java_info_from_path(&java_exe) {
                    if !java_list.iter().any(|j: &JavaInfo| j.path == java_info.path) {
                        java_list.push(java_info);
                    }
                }
            }
        }
    }

    // 按版本号排序（降序）
    java_list.sort_by(|a, b| b.version.cmp(&a.version));
    
    println!("Java 检测完成，找到 {} 个安装", java_list.len());
    for (i, java) in java_list.iter().enumerate() {
        println!("[{}] 版本: {}, 路径: {}, 64位: {}", 
            i + 1, java.version, java.path, java.arch);
    }
    
    java_list
}

fn check_directory_for_java(dir: &PathBuf, java_list: &mut Vec<JavaInfo>) {
    println!("检查目录: {:?}", dir);
    // 检查当前目录是否包含 java.exe
    let java_exe = dir.join("bin").join("java.exe");
    println!("查找 java.exe: {:?}", java_exe);
    if java_exe.exists() {
        println!("到 java.exe");
        if let Some(java_info) = get_java_info_from_path(&java_exe) {
            println!("成功获取 Java 信息: {:?}", java_info.version);
            if !java_list.iter().any(|j: &JavaInfo| j.path == java_info.path) {
                java_list.push(java_info);
            }
        } else {
            println!("无法获取 Java 信息");
        }
        return;
    }

    // 递归检查子目录
    if let Ok(entries) = fs::read_dir(dir) {
        for entry in entries.flatten() {
            let path = entry.path();
            if path.is_dir() {
                check_directory_for_java(&path, java_list);
            }
        }
    }
}

fn get_java_info_from_path(java_exe: &PathBuf) -> Option<JavaInfo> {
    let output = Command::new(java_exe)
        .arg("-version")
        .output()
        .ok()?;

    let version_info = String::from_utf8_lossy(&output.stderr);
    let version = extract_java_version(&version_info)?;
    let arch = extract_java_arch(&version_info)?;

    Some(JavaInfo {
        path: java_exe.to_string_lossy().to_string(),
        version,
        arch,
    })
}

#[tauri::command]
async fn get_java_info(path: String) -> Result<JavaInfo, String> {
    let path_buf = PathBuf::from(path);
    match get_java_info_from_path(&path_buf) {
        Some(info) => Ok(info),
        None => Err("无法获取Java信息".to_string())
    }
}

fn extract_java_version(version_str: &str) -> Option<String> {
    // 示例版本字符串：
    // java version "1.8.0_301"
    // openjdk version "11.0.12"
    let version_line = version_str.lines().next()?;
    let parts: Vec<&str> = version_line.split('"').collect();
    if parts.len() >= 2 {
        Some(parts[1].to_string())
    } else {
        None
    }
}

fn extract_java_arch(version_str: &str) -> Option<String> {
    // 检查是否包含64-Bit
    if version_str.contains("64-Bit") {
        Some("64位".to_string())
    } else {
        Some("32位".to_string())
    }
}

#[tauri::command]
async fn microsoft_auth(code: String) -> Result<String, String> {
    println!("开始 Microsoft 认证...");
    println!("授权码: {}", code);
    
    let client = reqwest::Client::builder()
        .danger_accept_invalid_certs(true)
        .build()
        .map_err(|e| e.to_string())?;
    
    // 获取访问令牌
    println!("正在请求访问令牌...");
    let token_response = client.post("https://login.live.com/oauth20_token.srf")
        .header("Content-Type", "application/x-www-form-urlencoded")
        .header("Accept", "application/json")
        .form(&[
            ("client_id", "00000000402b5328"),
            ("code", &code),
            ("grant_type", "authorization_code"),
            ("redirect_uri", "https://login.live.com/oauth20_desktop.srf"),
            ("scope", "XboxLive.signin offline_access")
        ])
        .send()
        .await
        .map_err(|e| {
            println!("请求访问令牌失败: {}", e);
            format!("请求访问令牌失败: {}", e)
        })?;

    println!("收到访问令牌响应，状态码: {}", token_response.status());
    
    let response_text = token_response.text().await.map_err(|e| {
        println!("读取响应内容失败: {}", e);
        format!("读取响应内容失败: {}", e)
    })?;
    
    println!("响应内容: {}", response_text);
    
    let token_data: serde_json::Value = serde_json::from_str(&response_text).map_err(|e| {
        println!("解析响应 JSON 失败: {}", e);
        format!("解析响应 JSON 失败: {}", e)
    })?;

    if token_data.get("error").is_some() {
        let error = token_data["error"].as_str().unwrap_or("unknown");
        let error_description = token_data["error_description"].as_str().unwrap_or("No description");
        println!("获取访问令牌失败: {} - {}", error, error_description);
        return Err(format!("获取访问令牌失败: {} - {}", error, error_description));
    }

    println!("成功获取访问令牌");
    Ok(response_text)
}

#[tauri::command]
async fn microsoft_xbox_auth(access_token: String) -> Result<String, String> {
    println!("开始 Xbox Live 认证...");
    let client = reqwest::Client::new();
    
    let xbl_response = client.post("https://user.auth.xboxlive.com/user/authenticate")
        .header("Content-Type", "application/json")
        .header("Accept", "application/json")
        .json(&serde_json::json!({
            "Properties": {
                "AuthMethod": "RPS",
                "SiteName": "user.auth.xboxlive.com",
                "RpsTicket": format!("d={}", access_token)
            },
            "RelyingParty": "http://auth.xboxlive.com",
            "TokenType": "JWT"
        }))
        .send()
        .await
        .map_err(|e| {
            println!("Xbox Live 认证请求失败: {}", e);
            e.to_string()
        })?;

    if !xbl_response.status().is_success() {
        let error_text = xbl_response.text().await.unwrap_or_default();
        println!("Xbox Live 认证失败: {}", error_text);
        return Err(format!("Xbox Live 认证失败: {}", error_text));
    }

    let xbl_data = xbl_response.json::<serde_json::Value>()
        .await
        .map_err(|e| {
            println!("解析 Xbox Live 响应失败: {}", e);
            e.to_string()
        })?;

    println!("成功获取 Xbox Live 令牌");
    Ok(xbl_data.to_string())
}

#[tauri::command]
async fn microsoft_xsts_auth(xbl_token: String) -> Result<String, String> {
    println!("开始 XSTS 认证...");
    let client = reqwest::Client::new();
    
    let xsts_response = client.post("https://xsts.auth.xboxlive.com/xsts/authorize")
        .header("Content-Type", "application/json")
        .header("Accept", "application/json")
        .json(&serde_json::json!({
            "Properties": {
                "SandboxId": "RETAIL",
                "UserTokens": [xbl_token]
            },
            "RelyingParty": "rp://api.minecraftservices.com/",
            "TokenType": "JWT"
        }))
        .send()
        .await
        .map_err(|e| {
            println!("XSTS 认证请求失败: {}", e);
            e.to_string()
        })?;

    if !xsts_response.status().is_success() {
        let error_text = xsts_response.text().await.unwrap_or_default();
        println!("XSTS 认证失败: {}", error_text);
        return Err(format!("XSTS 认证失败: {}", error_text));
    }

    let xsts_data = xsts_response.json::<serde_json::Value>()
        .await
        .map_err(|e| {
            println!("解析 XSTS 响应失败: {}", e);
            e.to_string()
        })?;

    println!("成功获取 XSTS 令牌");
    Ok(xsts_data.to_string())
}

#[tauri::command]
async fn microsoft_minecraft_auth(xbl_token: String, xsts_token: String, uhs: String) -> Result<String, String> {
    println!("开始 Minecraft 认证...");
    let client = reqwest::Client::new();
    
    let mc_response = client.post("https://api.minecraftservices.com/authentication/login_with_xbox")
        .header("Content-Type", "application/json")
        .json(&serde_json::json!({
            "identityToken": format!("XBL3.0 x={};{}", uhs, xsts_token)
        }))
        .send()
        .await
        .map_err(|e| {
            println!("Minecraft 认证请求失败: {}", e);
            e.to_string()
        })?;

    if !mc_response.status().is_success() {
        let error_text = mc_response.text().await.unwrap_or_default();
        println!("Minecraft 认证失败: {}", error_text);
        return Err(format!("Minecraft 认证失败: {}", error_text));
    }

    let mc_data = mc_response.json::<serde_json::Value>()
        .await
        .map_err(|e| {
            println!("解析 Minecraft 响应失败: {}", e);
            e.to_string()
        })?;

    println!("成功获取 Minecraft 令牌");
    Ok(mc_data.to_string())
}

#[tauri::command]
async fn microsoft_profile(access_token: String) -> Result<String, String> {
    println!("开始获取 Minecraft 档案...");
    let client = reqwest::Client::new();
    
    let profile_response = client.get("https://api.minecraftservices.com/minecraft/profile")
        .header("Authorization", format!("Bearer {}", access_token))
        .send()
        .await
        .map_err(|e| {
            println!("获取档案请求失败: {}", e);
            e.to_string()
        })?;

    if !profile_response.status().is_success() {
        let error_text = profile_response.text().await.unwrap_or_default();
        println!("获取档案失败: {}", error_text);
        return Err(format!("获取档案失败: {}", error_text));
    }

    let profile_data = profile_response.json::<serde_json::Value>()
        .await
        .map_err(|e| {
            println!("解析档案响应失败: {}", e);
            e.to_string()
        })?;

    println!("成功获取档案信息");
    Ok(profile_data.to_string())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            microsoft_auth,
            microsoft_xbox_auth,
            microsoft_xsts_auth,
            microsoft_minecraft_auth,
            microsoft_profile
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
