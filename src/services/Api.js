
/**
 * Wrapper for calling a API
 */

var NO_TOKEN_REQUIRED_REQ = ['/api/v1/sigininwithqq','/api/v1/signup', '/api/v1/signin','/api/v1/sendsms','/api/v1/confirm','/api/v1/class/join','/api/v1/updateuser'];


var Api = {

  /*
   *  Commonn function for making api call
   */
  Call: function(url, data, callBack, method='post', async=true){

      var no_token_found = false;

      var token = localStorage.getItem('access_token');

      var required_token = this.isTokenRequired( url );

      if(!token && required_token){
        location.href = "/";
        return;
      }

      if(data != null){
        data = JSON.stringify(data);
        
      }

      var req_url = API_HOST + url;
      if( url.indexOf('get_user_info') != -1){
        req_url = url;
      }else if(url.indexOf('api.weixin') != -1){
        req_url = url;
      }

      $.ajax({
          url:  req_url,
          type: method,
          data: data,  
          timeout: 10000,
          crossDomain: true,
          async: async,
          contentType: 'application/json',
          headers: {'X-ACCESS-TOKEN': token},
          
          // 通信成功時の処理
          success: function(result, textStatus, xhr) {
              // 入力値を初期化
              //$form[0].reset();
              console.log("Request:")
              console.log(url);
              if(data){
                if(url.indexOf('signin') < 0){
                  console.log(data);
                }
   
              }
              console.log("Server response:")
              console.log(result);

              return callBack(result);
          },
          
          // 通信失敗時の処理
          error: function(xhr, ajaxOptions, thrownErro) {
              console.log("Request:")
              console.log(url);
              if(data){
                if(url.indexOf('signin') < 0){
                  console.log(data);
                }
              }

            $.notify("Disconnected with api server, please try later.",{
            position:'bottom', className: "error" ,autoHideDelay: 5000
          }); 
          }
      });

  },

  isTokenRequired: function( url ){

    var isRequired = true;

    $.each(NO_TOKEN_REQUIRED_REQ, function(i, v){
      if(url.indexOf(v) > -1){
        isRequired = false;
        return;
      }
    });

    return isRequired;
  }
};

module.exports = Api;