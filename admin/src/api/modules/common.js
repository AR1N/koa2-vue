import {post} from '@/util/request'

const common = {
    upload(file){
        return post('/common/uploadFile',file)
    }
}

export default common
