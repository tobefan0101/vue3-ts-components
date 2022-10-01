// 获取base64图片的大小
async function getAttrsByBase64(src: string) {
  return new Promise((resolve, reject) => {
    const regArr = /data:image\/(.+?);/.exec(src);
    if (regArr) {
      const extension = regArr[1].toUpperCase();
      const img = new Image();
      img.src = src;
      const strLength = src.length;
      const fileLength = parseInt((strLength - (strLength / 8) * 2).toString());
      const size = (fileLength / 1024).toFixed(2);
      img.onload = function () {
        resolve({
          with:img.width,
          height:img.height,
          size,
          extension
        })
      };
    }
  });
}

// 动态组件

// const component = shallowRef(new Map<string, any>())
// routeConfig.forEach((item) => {
//   component.value.set(
//     item.key,
//     defineAsyncComponent(() => import(`@/views/${item.path}.vue`))
//   )
// })

// 颜色+透明度修改图片颜色

import Jimp from 'jimp'
interface colorizeParams {
  img: string
  color: string
  alpha: number
}
export async function colorizeImg(params: colorizeParams) {
  const imgBuffer = Buffer.from(
    params.img.replace(/^data:image\/\w+;base64,/, ''),
    'base64'
  )
  const image = await Jimp.read(imgBuffer)
  return new Promise((resolve, reject) => {
    image
      .color([
        {
          apply: 'red',
          params: [-255]
        },
        {
          apply: 'green',
          params: [-255]
        },
        {
          apply: 'blue',
          params: [-255]
        }
      ])
      .opacity(params.alpha / 100)
    image.color([
      {
        apply: 'xor',
        params: [params.color]
      }
    ])
    image.getBase64(image.getMIME(), (err, str) => {
      if (err) {
        reject()
      }
      resolve(str)
    })
  })
}

// electron多窗口管理
// global.d.ts
import { BrowserWindow } from 'electron'
declare global {
  namespace NodeJS {
    interface Global {
      mainWin: BrowserWindow
      childWins: Map<string, BrowserWindow>
    }
  }
}

import { BrowserWindow } from 'electron'
import path from 'path'
export const initMain = (win: BrowserWindow) => {
  global.mainWin = win
  global.childWins = new Map<string, BrowserWindow>()
}
export const closeAllWin = () => {
  global.childWins.forEach((item) => item.close())
  global.childWins.clear()
}
export const closeWin = (key: string) => {
  const win = global.childWins.get(key)
  if (win) {
    win.close()
  }
}
export const openNewWindow = (params) => {
  const win = global.childWins.get(params.name)
  if (win) {
    win.focus()
  } else {
    const winURL =
      process.env.NODE_ENV === 'development'
        ? `http://localhost:8080`
        : `file://${__dirname}/index.html`
    const newWin = new BrowserWindow({
      width: 900,
      height: 620,
      minWidth: 900,
      minHeight: 620,
      autoHideMenuBar: true,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
      }
    })
    global.childWins.set(params.name, newWin)
    newWin.loadURL(winURL + `#${params.path}`)
    newWin.on('close', () => {
      global.childWins.delete(params.name)
    })
  }
}
// 文件存储路径
export const getAppDataPath = () => {
  switch (process.platform) {
    case 'darwin': {
      return path.join(
        process.env.HOME,
        'Library',
        'Application Support',
        'i-theme'
      )
    }
    case 'win32': {
      return path.join(process.env.APPDATA, 'i-theme')
    }
    case 'linux': {
      return path.join(process.env.HOME, '.i-theme')
    }
    default: {
      console.log('Unsupported platform!')
      process.exit(1)
    }
  }
}

//
// 包装media请求协议，以便在node端劫持
export const getFile = (path: string) => {
  return 'atom:///' + path
}
// node:
protocol.registerFileProtocol('atom', (request, callback) => {
    const url = request.url.slice(8)
    const host = getAppDataPath()
    console.log(path.join(host, 'media', url))
    callback({
      path: path.join(host, 'media', url)
    })
  })


  // 项目规则配置
  npm i prettier --save
// .prettierrc
{
  "tabWidth": 2,
  "useTabs": false,
  "endOfLine": "auto",
  "singleQuote": true,
  "semi": false,
  "trailingComma": "none",
  "bracketSpacing": true
}
//.eslintrc.js
{
  module.exports = {
    root: true,
    env: {
      node: true
    },
    extends: [
      'plugin:vue/vue3-essential',
      'eslint:recommended',
      '@vue/typescript/recommended',
      '@vue/prettier',
      '@vue/prettier/@typescript-eslint'
    ],
    parserOptions: {
      ecmaVersion: 2020
    },
    plugins: [
      // 用到的插件
      '@typescript-eslint',
      'prettier'
    ],
    globals: {
      PublicKeyCredential: true
    },
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'prettier/prettier': 'error', // prettier标记的地方抛出错误信息
      'spaced-comment': [2, 'always'], // 注释后面必须写两个空格
      '@typescript-eslint/no-explicit-any': ['off'], // 关闭any校验
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['off']
    }
  }
}

// .editorconfig
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true


// electron通信
JS：
export const getInitData = () => {
  return ipcRenderer.invoke('get-init-data')
}
NODE：
ipcMain.handle('get-init-data', () => {
    return new Promise((resolve) => {
      resolve(unPackage(true))
    })
  })
  ipcMain.handle('save-image', async (event, params) => {
    try {
      return await downloadImage(params)
    } catch {
      return 'error'
    }
  })


  // 替换png图片中的部分颜色
  const replaceColor = require('replace-color')
 
replaceColor({
  image: './test.png',
  colors: {
    type: 'rgb',
    targetColor: [218, 71, 77],
    replaceColor: [83, 158, 85]
  },
  deltaE: 10
})
  .then((jimpObject) => {
    jimpObject.write('./output.png', (err) => {
      if (err) return console.log(err)
    })
  })
  .catch((err) => {
    console.log(err)
  })

  // electron新窗口通信
  export const openAddProjectWindow = (
    params: Pick<RequestParams, 'name' | 'path'>
  ) => {
    ipcRenderer.send('new-window', params)
    // 接收主线程的通信： 新建项目完成后，关闭子窗口
    ipcRenderer.on('add-project-back', (event, res: Record<string, any>) => {
      store.commit('SET_PROJECT_ID', res.id)
      closeWindow({
        name: 'addProject',
        path: '/loading'
      })
    })
  }
    ipcMain.on('new-window', (event, params) => {
      openNewWindow(params)
    })
    ipcMain.handle('add-project', (event, params) => {
      addProject(params).then(() => {
        global.mainWin.webContents.send('add-project-back', params)
      })
    })