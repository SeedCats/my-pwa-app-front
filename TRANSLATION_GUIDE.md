# Translation Guide

## Overview
This project uses **vue-i18n** for internationalization (i18n) support with English and Chinese languages.

## Quick Usage

### In Templates
```vue
<template>
  <!-- Direct translation -->
  <h1>{{ $t('auth.welcomeBack') }}</h1>
  
  <!-- In attributes -->
  <input :placeholder="$t('auth.email')" />
  
  <!-- In button text -->
  <button>{{ $t('common.save') }}</button>
</template>
```

### In Script (Composition API)
```vue
<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// Use in variables
const title = t('home.title')
const message = computed(() => t('common.welcome'))
</script>
```

## Changing Language
The language switcher button is located in the top bar (next to the user profile).
- Click the flag icon/language name
- Select English (🇺🇸) or 中文 (🇨🇳)
- The language change is immediate and saved to localStorage

## Available Translations

### Common
- `common.loading` - "Loading..." / "加载中..."
- `common.save` - "Save" / "保存"
- `common.cancel` - "Cancel" / "取消"

### Auth
- `auth.welcomeBack` - "Welcome Back" / "欢迎回来"
- `auth.login` - "Sign in" / "登录"
- `auth.email` - "Email address" / "电子邮箱"

### Navigation
- `nav.home` - "Home" / "首页"
- `nav.dataSettings` - "Data Settings" / "数据设置"
- `nav.aiSupport` - "AI Support" / "AI 支持"

### Views
- `home.bmi.title` - "BMI Information" / "BMI 信息"
- `dataSettings.title` - "Data Setting" / "数据设置"
- `aiSupport.title` - "AI Support Chat" / "AI 支持聊天"
- `userSettings.title` - "Account Settings" / "账户设置"
- `formatSettings.title` - "Settings" / "设置"

## Adding New Translations

1. Edit `src/locales/en.json` for English
2. Edit `src/locales/zh.json` for Chinese
3. Use the key in your component: `{{ $t('your.new.key') }}`

Example:
```json
// en.json
{
  "myFeature": {
    "title": "My Feature",
    "description": "This is my feature"
  }
}

// zh.json
{
  "myFeature": {
    "title": "我的功能",
    "description": "这是我的功能"
  }
}
```

## Adding More Languages

1. Create new locale file: `src/locales/es.json` (for Spanish)
2. Import in `src/i18n.js`:
   ```js
   import es from './locales/es.json'
   ```
3. Add to messages:
   ```js
   messages: { en, zh, es }
   ```
4. Add to useLanguage composable:
   ```js
   { code: 'es', name: 'Español', flag: '🇪🇸' }
   ```

## Language Persistence
- User's language preference is saved to `localStorage`
- On first visit, the app detects browser language (defaults to English if not Chinese)
- Language persists across sessions
