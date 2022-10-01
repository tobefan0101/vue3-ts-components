import { promises } from 'fs'
import path from 'path'
import { getAppDataPath } from './utils'

const host = getAppDataPath()
const execPath = path.join(host, 'media')

export const isExist = (url: string) => {
  return promises.stat(url)
}
export const mkdir = (url: string) => {
  return promises.mkdir(url)
}

export const rmDir = (url: string) => {
  return promises.rmdir(url)
}
export const delFile = (url: string, name: string) => {
  const dir = path.join(execPath, url, name)
  return promises.unlink(dir)
}
export const saveFile = async (
  url: string,
  oriName: string,
  name: string,
  content: NodeJS.ArrayBufferView | Iterable<string | NodeJS.ArrayBufferView>
) => {
  const dir = path.join(execPath, url)
  try {
    await isExist(dir)
  } catch {
    await mkdir(dir)
  }
  return promises.writeFile(path.join(dir, name), content, {
    encoding: 'utf8'
  })
}
export const readFile = (url: string, name: string) => {
  return promises.readFile(path.join(execPath, url, name), { encoding: 'utf8' })
}
export const readImg = (url: string, name: string) => {
  return promises.readFile(path.join(execPath, url, name), {
    encoding: 'base64'
  })
}