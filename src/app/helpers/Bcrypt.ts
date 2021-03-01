import {hash, compare} from "bcrypt";

/**
 * class Bcrypt
 *
 * @public @static hash(value: string): Promise<string>
 * @public @static compare(value: string, hash: string): Promise<boolean>
 */
export class Bcrypt {

    /**
     * Hashes a value, passed in arguments
     * @param value
     */
    public static hash(value: string): Promise<string> {
        return new Promise(resolve => {
            hash(value, 10, (err, hash) => {
                if (err) {
                    console.log('Bcrypt #hash: ', err);
                } else {
                    resolve(hash);
                }
            });
        });
    }

    /**
     * Compares value and hash, bcrypted by #hash static method
     * @param value
     * @param hash
     */
    public static compare(value: string, hash: string): Promise<boolean> {
        return new Promise<boolean>(resolve => {
            compare(value, hash, (err, result) => {
                if (err) {
                    console.log('Bcrypt #compare: ', err);
                } else {
                    resolve(result);
                }
            });
        });
    }

}
