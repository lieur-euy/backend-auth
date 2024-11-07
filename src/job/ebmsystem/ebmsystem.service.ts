import { Injectable } from '@nestjs/common';

@Injectable()
export class EbmsystemService {

    async getUser() {
        try {
            const res: any = fetch("")
            const data: User = (await res).json()
            const send = this.upsertUser(data)
            return send
        } catch (err) {

        }
    }

    private upsertUser(data: User) {

        // save data 


    }
}


//type

interface User {
    id: string;

}