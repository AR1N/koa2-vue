import CryptoJS from 'crypto-js'
const secret = {
    //加密
    Encrypt(dataStr, key, iv) {
        let encrypted = CryptoJS.AES.encrypt(dataStr, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.ZeroPadding
        })
        return encrypted.toString()
    },
    //解密
    // Decrypt(dataStr, key, iv) {
    //     let decrypt = CryptoJS.AES.decrypt(dataStr, key, {
    //         iv: iv,
    //         mode: CryptoJS.mode.CBC,
    //         padding: CryptoJS.pad.ZeroPadding
    //     })
    //     let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
    //     return decryptedStr.toString()
    // }
}

export default secret
