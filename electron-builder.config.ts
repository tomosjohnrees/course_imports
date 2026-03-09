import { join } from 'path'
import { Configuration } from 'electron-builder'
import { FuseV1Options, FuseVersion, flipFuses } from '@electron/fuses'

const config: Configuration = {
  appId: 'com.course-imports.app',
  productName: 'Course Imports',
  directories: {
    buildResources: 'build',
    output: 'dist'
  },
  files: [
    'out/**/*',
    '!out/**/*.map',
    '!out/**/*.test.*',
    '!out/**/*.spec.*',
    '!out/**/test/**',
    '!out/**/tests/**',
    '!out/**/__tests__/**'
  ],
  icon: 'build/icon',
  asar: true,
  afterPack: async (context) => {
    const ext = { darwin: '.app', win32: '.exe', linux: '' }
    const suffix = ext[context.electronPlatformName as keyof typeof ext] ?? ''
    const name = context.electronPlatformName === 'linux'
      ? context.packager.executableName
      : context.packager.appInfo.productFilename
    const execPath = join(context.appOutDir, `${name}${suffix}`)
    await flipFuses(execPath, {
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true
    })
  },
  mac: {
    target: [
      {
        target: 'dmg',
        arch: ['universal']
      }
    ],
    icon: 'build/icon.icns',
    hardenedRuntime: true,
    category: 'public.app-category.education'
  },
  win: {
    target: [
      {
        target: 'nsis',
        arch: ['x64']
      }
    ],
    icon: 'build/icon.ico'
  },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true
  },
  linux: {
    target: [
      {
        target: 'AppImage',
        arch: ['x64']
      }
    ],
    icon: 'build/icon.png',
    category: 'Education'
  }
}

export default config
