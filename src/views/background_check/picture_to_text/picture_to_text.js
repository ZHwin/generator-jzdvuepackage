import { iframeDownload } from '@utils/tools'

export default {
  name: 'PictureToText',
  methods: {
    downloadOCR () {
      iframeDownload('http://10.73.41.6:7800/OCR识别.7z')
    }
  }
}
