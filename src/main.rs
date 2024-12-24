// 删除或重命名其中一个get_java_info函数
// 将原来的函数重命名为get_java_info_from_path
fn get_java_info_from_path(java_exe: &PathBuf) -> Option<JavaInfo> {
    let output = Command::new(java_exe)
        .arg("-version")
        .output()
        .ok()?;
    // ... rest of implementation ...
}

// 修改异步函数使用String参数
#[tauri::command]
async fn get_java_info(path: String) -> Result<JavaInfo, String> {
    let path_buf = PathBuf::from(path);
    match get_java_info_from_path(&path_buf) {
        Some(info) => Ok(info),
        None => Err("无法获取Java信息".to_string())
    }
}

// 在tauri::Builder中的invoke_handler保持不变
.invoke_handler(tauri::generate_handler![
    get_username,
    detect_java_installations,
    select_java_path,
    select_java_folder,
    get_java_info
]) 