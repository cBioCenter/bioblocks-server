
class _BioBlocksFrameAPI{

    constructor(){
        this.instantiations = {};
    }

    addInstantiation(app_id){
        //fix class objects to local scope
        const instantiations = this.instantiations;
        const hex2ascii = this._hex2ascii;
        const dispatchPostMessage = this._dispatchPostMessage;

        //post to bioblocks.org
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "http://0.0.0.0:11037/instantiation", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(
            JSON.stringify({ app_id: app_id })
        );

        xhr.onload = function() {
            const data = JSON.parse(this.responseText);
            console.log('(parent) instantiation processed by server with response', data);

            //listen for the new apps messages
            instantiations[data.instantiation_id] = {
                outgoing_messages: [],
                instantiation_id: data.instantiation_id,
                hidden_instantiation_id: data.hidden_instantiation_id,
                parent_private_key: data.parent_private_key,
                frame_public_key: data.frame_public_key,
                shared_communication_secret: data.shared_communication_secret,
                rsa_encryptor: new JSEncrypt(),
                rsa_decryptor: new JSEncrypt()
            }
            instantiations[data.instantiation_id].rsa_encryptor.setPublicKey( 
                hex2ascii(data.frame_public_key) 
            );
            instantiations[data.instantiation_id].rsa_decryptor.setPrivateKey( 
                hex2ascii(data.parent_private_key) 
            );
            
            /**
             *  Listen for and respond to messages
             *  Messages take the form:
             *     { 
             *       key:           RSA encrypted AES key 
             *       message_id:    Unique id for this call - used to inform response 
             *       payload:       AES encrypted payload in hex. Takes the form:
             *            {
             *              shared_communication_secret: A secret key provided by the server that only
             *                                           the frame is aware of.
             *              fn:                          Function to execute. See below.
             *              params:                      An object that contains key value pairs for
             *                                           the function. See below.
             *            }
             *     }
             * 
             *  Valid fn and params values:
             *     fn                params                    success_data in returned payload
             *     --                ------                    --------------------------------
             *     init              null | {}                 {}
             *     get_object        { obj_id: uuid }          { obj_id: uuid, obj: byte[] }
             * 
             *  Responses take the form:
             *     {
             *         message_id:               The same id passed in the requesting message.
             *         target_instantiation_id:  UUID unique for the instantiation (sever provided)
             *         key:                      RSA encrypted AES key
             *         payload:                  AES encrypted payload in hex. Takes the form:
             *           {
             *             shared_communication_secret: A secret key provided by the server that only
             *                                          the frame is aware of.
             *             response_error:              If 'response_error' is set then 'success_data' 
             *                                          will not be set and the value of 'response_error'
             *                                          will contain an object like:
             *                     {error_code: int, 
             *                      error_desc: 'User readable error description.'}
             * 
             *             success_data:                If set, the function executed successfully and
             *                                          this value will contain the return value from
             *                                          the function.
             *           }
             *         
             *     }
             * 
             */
            window.addEventListener('message', function(e) {
                console.log('(parent) message received with event:', e);
                const instantiation =  instantiations[data.instantiation_id];
                
                if (e.data && 
                    e.data.instantiation_id === instantiation.hidden_instantiation_id){

                    //the aes key is decrypted by the frame with RSA as RSA has a severe
                    //length restriction
                    // https://crypto.stackexchange.com/questions/14/how-can-i-use-asymmetric-encryption-such-as-rsa-to-encrypt-an-arbitrary-length
                    const aes_decryption_key = aesjs.utils.hex.toBytes( 
                        instantiation.rsa_decryptor.decrypt( e.data.key )
                    );
                    if (!aes_decryption_key) {
                        console.error('(parent) error: unable to decrypt aes key');
                        dispatchPostMessage(
                            e, instantiation.rsa_encryptor,
                            e.data.message_id, instantiation.hidden_instantiation_id,
                            {
                                shared_communication_secret: instantiation.shared_communication_secret,
                                response_error: {
                                error_code: 100,
                                error_desc: 'unable to decrypt key'}
                            }
                        );
                        return;
                    }
                    
                    //attempt to decrypt the payload
                    let aesCtr = new aesjs.ModeOfOperation.ctr(aes_decryption_key);
                    const payload = JSON.parse(
                        aesjs.utils.utf8.fromBytes(
                            aesCtr.decrypt( 
                                aesjs.utils.hex.toBytes(e.data.payload) 
                            )
                        )
                    );
                    if(!payload){
                        console.error('(parent) unable to parse and decrypt payload from instantiation ', instantiation);
                        
                        dispatchPostMessage(
                            e, instantiation.rsa_encryptor,
                            e.data.message_id, instantiation.hidden_instantiation_id,
                            {
                                shared_communication_secret: instantiation.shared_communication_secret,
                                response_error: {
                                error_code: 101,
                                error_desc: 'unable to parse and decrypt payload'}
                            }
                        );
                        return;
                    }

                    console.log('(parent) decrypted payload=', payload);
                    if (!payload.shared_communication_secret || 
                        payload.shared_communication_secret !== instantiation.shared_communication_secret){
                        console.error('(parent) Invalid communication attempt from iframe. Communication secrets do not match:');
                        console.error(' - parent shared_communication_secret='+instantiation.shared_communication_secret);
                        console.error(' - iFrame shared_communication_secret='+payload.shared_communication_secret);
                        
                        dispatchPostMessage(
                            e, instantiation.rsa_encryptor,
                            e.data.message_id, instantiation.hidden_instantiation_id,
                            {
                                shared_communication_secret: instantiation.shared_communication_secret,
                                response_error: {
                                error_code: 102,
                                error_desc: 'shared_communication_secret fields do not match.'}
                            }
                        );
                        return;
                    }

                    console.log('(parent) iframe message received and validated');
                    //TODO execute the requested function



                    //respond with results
                    dispatchPostMessage(
                        e, instantiation.rsa_encryptor,
                        e.data.message_id, instantiation.hidden_instantiation_id,
                        {
                            shared_communication_secret: instantiation.shared_communication_secret,
                            success_data: {'the payload key':'this is the value of the payload key'}
                        }
                    );
                };
            });

            const iframe = document.createElement("iframe");
            iframe.setAttribute("id", `${data.instantiation_id}`);
            iframe.setAttribute("sandbox", "allow-scripts");
            iframe.setAttribute(
                "src",
                `http://0.0.0.0:11038/instantiation/${data.instantiation_id}`
            );
            document.getElementById("parent_body").appendChild(iframe); //WORKS
            setTimeout(function(){
                console.log('SENDING MESSAGE');
                iframe.contentWindow.postMessage('hello', '*');
            }, 2000);

            //console.log('iframe.contentWindow:' + iframe.contentWindow); //FAILS
            iframe.contentWindow.addEventListener('message', function(e) {
                console.log('******************\nI AM SNOOPING!!!!!\n********************');
            });
        };

    }

    _dispatchPostMessage(event, rsa_encryptor, message_id, hidden_instantiation_id, unencrypted_payload_obj){
        const cryptoObj = window.crypto || window.msCrypto;
        const aesKeyBytes = cryptoObj.getRandomValues(new Uint8Array(16)); // 16 digits = 128 bit key
        const aesCtr = new aesjs.ModeOfOperation.ctr(aesKeyBytes)
        event.source.postMessage({ //only post to a specific frame
            key: rsa_encryptor.encrypt( aesjs.utils.hex.fromBytes( aesKeyBytes )),
            message_id: message_id,
            target_instantiation_id: hidden_instantiation_id,
            payload: aesjs.utils.hex.fromBytes(   //convert encrypted bytes to hex for postmessage
                aesCtr.encrypt(                   //AES encrypt the object bytes
                    aesjs.utils.utf8.toBytes(     //convert object string to bytes
                        JSON.stringify( unencrypted_payload_obj ) 
                    )
                )
            )
        },'*'); //http://0.0.0.0:11038
    }

    _hex2ascii(hex){ //convert hex to a string
        var str = '';
        for (var i = 0; i < hex.length; i += 2) str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        return str;
    }
}

export const bbAPI = new _BioBlocksFrameAPI();
