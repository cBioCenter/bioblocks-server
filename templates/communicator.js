class _BioBlocksFrameAPI {
  constructor() {
    console.log('({{hidden_instantiation_id}}) constructing _BioBlocksFrameAPI');
    this._app_id = '{{app_id}}';
    this._hidden_instantiation_id = '{{hidden_instantiation_id}}';
    this._shared_communication_secret = '{{shared_communication_secret}}';

    //setup RSA encryption
    this._rsa_encryptor = new JSEncrypt();
    this._rsa_decryptor = new JSEncrypt();
    this._rsa_encryptor.setPublicKey(
      this._hex2ascii('{{parent_public_key}}')
    );
    this._rsa_decryptor.setPrivateKey(
      this._hex2ascii('{{frame_private_key}}')
    );

    //setup postmessage listeners
    this._setupPMListener();
    
    //
    // attempt handshake with parent
    // - verify parent is available 
    // - verify parent can encrypt / decrypt messages with server-provided keys
    //
    this._callFn('initialize', {'my test key': 'has a value!!'}).then(
      function(response) {	//initialization succeeded
        console.log('({{hidden_instantiation_id}}) initialization succeeded', response);
      },
      function(err){ //initialization failed
        console.error('({{hidden_instantiation_id}}) communication with bioblocks failed', err);
    		delete this._rsa_encryptor;
    		delete this._rsa_decryptor;
      }
    );
  }
  

  //
  //
  // MAIN FUNCTIONS EXPOSED TO APP
  //
  //
  addDataUpdatedListener(fn){
  	if (!this._data_updated_listeners){ this._data_updated_listeners = []; }
  	this._data_updated_listeners.append(fn);
  }



  //
  //
  // PRIVATE
  //
  //
  
  /**
   * _setupPMListener: This function will coordinate all incoming message events. It 
   *                   will respond to [1] postMessages that are in response to api calls
   *                   (i.e., the message_id is in this singleton's message_id->promise 
   *                   hashmap), and [2] postMessages that target this instantiation.
   *                   In addition, this function will validate all messages and dispatch
   *                   them appropriately.
   */
  _setupPMListener(){
    //setup system for monitoring postmessages and resolving/rejecting promises
    this._message_promises = {};

    //setup variable access within async message function
    const instantiation_id = this._instantiation_id;
    const hidden_instantiation_id = this._hidden_instantiation_id;
    const shared_communication_secret = this._shared_communication_secret;
    const rsa_decryptor = this._rsa_decryptor;
    const message_promises = this._message_promises;

    //setup single async message listener
    window.addEventListener('message', function(e) {
      console.log('({{hidden_instantiation_id}}) message received in iframe:', e);

      //is this message aimed at this instantiation
      if (e.origin === '{{config["BB_ORIGIN"]}}' && e.data &&
          e.data.target_instantiation_id === hidden_instantiation_id){
        
        //decrypt step 1: decrypt aes key
        const aes_decryption_key = aesjs.utils.hex.toBytes( 
          rsa_decryptor.decrypt( e.data.key )
        );

        //decrypt step 2: decrypt the aes encrypted payload
        let aesCtr = new aesjs.ModeOfOperation.ctr(aes_decryption_key);
        const payload = JSON.parse(
          aesjs.utils.utf8.fromBytes(
            aesCtr.decrypt( 
              aesjs.utils.hex.toBytes(e.data.payload) 
            )
          )
        );

        console.log('({{hidden_instantiation_id}}) instantiation received payload:', payload);
    	  if (payload.shared_communication_secret !== shared_communication_secret){
          console.error('({{hidden_instantiation_id}}) Invalid communication attempt from parent. Communication secrets do not match:');
          console.error(' - parent shared_communication_secret='+payload.shared_communication_secret);
          console.error(' - iFrame shared_communication_secret='+shared_communication_secret);
    	    return;
    	  }
        
        if(e.data.message_id && message_promises[e.data.message_id]){
          //parent is responding to one of our previous requests
    	    const promise = message_promises[e.data.message_id];
          delete message_promises[e.data.message_id];
          
    	    if(payload.response_error){
    	      promise.reject(
    		      'postMessage error: parent returned error:', payload.response_error.error_desc
    	      );
    	      return;
    	    }
    	    else{
            console.log('({{hidden_instantiation_id}}) promise:', promise);
    	      promise.resolve(payload.success_data);
    	      return;
          }
        }
        else{ 
          //parent is initiating a new request
          console.log('({{hidden_instantiation_id}}) parent appears to be initiating a new request');
    			let request = payload;
    			//switch(request.fn){
    				//case('data_updated'): asdf
    			//}
        }
      }	
      else{
        console.log(
          '({{hidden_instantiation_id}}) postMessage detected not targeted at this instantiation', instantiation_id
        );
      }
    });
  }
  
  
  /**
   * _callFn: call a function through postMessage. returns a promise that will 
   *          resolve with the parent response or raise an error.
   */
  _callFn(fn, payload){
    //generate a unique message id, populate and encrypt data, execute postMessage call
    const message_id = this._uuid();
    const unencrypted_payload_obj = Object.assign(
  	  { fn: fn, shared_communication_secret: this._shared_communication_secret },
  	  payload 
    );

    const rsa_encryptor = this._rsa_encryptor;
    const hidden_instantiation_id = this._hidden_instantiation_id;

    let promiseResolve, promiseReject;
    const promise = new Promise(function(resolve, reject) {
      const cryptoObj = window.crypto || window.msCrypto;
      const aesKeyBytes = cryptoObj.getRandomValues(new Uint8Array(16)); // 16 digits = 128 bit key
      const aesCtr = new aesjs.ModeOfOperation.ctr(aesKeyBytes)

      //console.log('sending message '+message_id+' to window ', window.parent);
  		window.parent.postMessage({
          key: rsa_encryptor.encrypt( aesjs.utils.hex.fromBytes( aesKeyBytes )),
          instantiation_id: hidden_instantiation_id,
  			  message_id: message_id,
          payload: aesjs.utils.hex.fromBytes(   //convert encrypted bytes to hex for postmessage
            aesCtr.encrypt(                     //AES encrypt the object bytes
              aesjs.utils.utf8.toBytes(         //convert object string to bytes
                JSON.stringify( unencrypted_payload_obj ) 
              )
            )
          )
  		  },
  		  '{{config["BB_ORIGIN"]}}'
      );
      promiseResolve = resolve;
      promiseReject = reject;
  	});
  	
  	this._message_promises[message_id] = {
      promise: promise, 
      resolve: promiseResolve, 
      reject: promiseReject
    };
  	return promise;
  }

  /**
   * _hex2ascii: convert a string that contains hex into ASCII
   */
  _hex2ascii(hex){
    var str = '';
    for (var i = 0; i < hex.length; i += 2) str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
  }

  /**
   * _uuid: generate random UUID 
   */
  _uuid(){
    function _p8(s) {
      var p = (Math.random().toString(16)+"000000000").substr(2,8);
      return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
    }
    return _p8() + _p8(true) + _p8(true) + _p8();
  }
}

export const bbAPI = new _BioBlocksFrameAPI();
