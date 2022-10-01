import { dialog, shell } from 'electron'
import { getAppDataPath } from './utils'
import path from 'path'
import fs, { promises } from 'fs'
import { setProgress } from './communication'

const host = getAppDataPath()
const uploadVideo = async (targetPath: string, name: string) => {
  const filePath = path.join(host, 'media', name)
  const file = fs.createReadStream(targetPath)
  const out = fs.createWriteStream(filePath)
  const { size } = fs.statSync(targetPath)
  let written = 0
  return new Promise((resolve, reject) => {
    out.on('error', (error) => {
      console.log(error)
      reject('error')
    })
    file.on('data', function (dataChunk) {
      out.write(dataChunk, function () {
        written += dataChunk.length
        const progress = Math.ceil((written / size) * 100)
        setProgress(progress)
        if (progress === 100) {
          resolve(name)
          // out.end()
        }
      })
    })
  })
}

const uploadImage = (targetPath: string) => {
  const { size } = fs.statSync(targetPath) // 获取大小
  const dotIndex = targetPath.lastIndexOf('.')
  const extension = dotIndex > -1 ? targetPath.slice(dotIndex + 1) : ''
  const setIndex = targetPath.lastIndexOf(path.sep)
  const name = dotIndex > -1 ? targetPath.slice(setIndex + 1) : ''
  return new Promise((resolve, reject) => {
    promises
      .readFile(targetPath, {
        encoding: 'base64'
      })
      .then((res) => {
        resolve({
          src: 'data:image/' + extension + ';base64,' + res,
          size,
          extension,
          name
        })
      })
      .catch(reject)
  })
}

export const uploadFile = async (params: {
  title: string
  extensions: string[]
  name: string
}) => {
  const targetPath = dialog.showOpenDialogSync({
    title: params.title,
    filters: [{ name: 'File', extensions: params.extensions }]
  })
  if (targetPath && targetPath.length > 0) {
    if (targetPath[0].includes('.mp4')) {
      return await uploadVideo(targetPath[0], params.name)
    } else {
      return uploadImage(targetPath[0])
    }
  } else {
    throw 'cancel'
  }
}

export const deleteFile = async (params: { name: string }) => {
  const filePath = path.join(host, 'media', params.name)
  return promises.unlink(filePath)
}

export const openFold = (params: { path: string[] }) => {
  const filePath = path.join(host, ...params.path)
  // shell.openPath(filePath)
  shell.showItemInFolder(filePath)
}

export const saveAsOtherPath = async (params: { path: string[] }) => {
  const filePath = path.join(host, ...params.path)
  const exportPath = dialog.showSaveDialogSync({
    title: '请选择导出路径级文件名',
    defaultPath: process.cwd(),
    buttonLabel: '保存'
  })
  if (!exportPath) {
    return 'cancel'
  } else {
    fs.copyFileSync(filePath, exportPath + '.itz')
    return 'success'
  }
}