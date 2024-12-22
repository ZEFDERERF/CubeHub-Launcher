import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login } from 'auth-microsoft'

export interface Account {
  id: string
  username: string
  type: 'microsoft' | 'offline'
  avatar: string
  accessToken?: string
}

export const useAccountStore = defineStore('account', () => {
  const accounts = ref<Account[]>([])
  const currentAccountId = ref<string | null>(null)

  const currentAccount = computed(() => 
    accounts.value.find(acc => acc.id === currentAccountId.value)
  )

  // Microsoft 登录
  async function loginWithMicrosoft() {
    try {
      const result = await login({
        clientId: "your-client-id", // 需要替换为你的 Microsoft Azure 应用程序 ID
        redirectUri: "http://localhost:8080/auth/callback",
        scopes: ["XboxLive.signin"]
      })

      if (result) {
        const msAccount: Account = {
          id: result.id || `ms-${Date.now()}`,
          username: result.username || 'Microsoft User',
          type: 'microsoft',
          avatar: result.avatar || 'path/to/default/avatar',
          accessToken: result.accessToken
        }
        
        accounts.value.push(msAccount)
        currentAccountId.value = msAccount.id
        saveAccounts()
        
        return msAccount
      }
    } catch (error) {
      console.error('Microsoft login failed:', error)
      throw error
    }
  }

  // 离线登录
  async function loginOffline(username: string) {
    const offlineAccount = {
      id: `offline-${Date.now()}`,
      username,
      type: 'offline',
      avatar: 'path/to/default/avatar'
    }
    
    accounts.value.push(offlineAccount)
    currentAccountId.value = offlineAccount.id
    
    // 保存到本地存储
    saveAccounts()
  }

  // 切换当前账号
  function setCurrentAccount(account: Account) {
    currentAccountId.value = account.id
    saveAccounts()
  }

  // 移除账号
  async function removeAccount(account: Account) {
    const index = accounts.value.findIndex(acc => acc.id === account.id)
    if (index > -1) {
      accounts.value.splice(index, 1)
      if (currentAccountId.value === account.id) {
        currentAccountId.value = accounts.value[0]?.id || null
      }
      saveAccounts()
    }
  }

  // 保存账号到本地存储
  function saveAccounts() {
    localStorage.setItem('minecraft-accounts', JSON.stringify({
      accounts: accounts.value,
      currentAccountId: currentAccountId.value
    }))
  }

  // 从本地存储加载账号
  function loadAccounts() {
    const saved = localStorage.getItem('minecraft-accounts')
    if (saved) {
      const data = JSON.parse(saved)
      accounts.value = data.accounts
      currentAccountId.value = data.currentAccountId
    }
  }

  // 初始化时加载账号
  loadAccounts()

  return {
    accounts,
    currentAccount,
    loginWithMicrosoft,
    loginOffline,
    setCurrentAccount,
    removeAccount
  }
}) 
