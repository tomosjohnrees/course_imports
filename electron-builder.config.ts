import { Configuration } from 'electron-builder'

const config: Configuration = {
  appId: 'com.course-imports.app',
  productName: 'Course Imports',
  directories: {
    buildResources: 'build',
    output: 'dist'
  },
  files: [
    'out/**/*',
    '!out/**/*.map'
  ],
  asar: true,
  mac: {
    target: [
      {
        target: 'dmg',
        arch: ['universal']
      }
    ],
    category: 'public.app-category.education'
  },
  win: {
    target: [
      {
        target: 'nsis',
        arch: ['x64']
      }
    ]
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
    category: 'Education'
  }
}

export default config
