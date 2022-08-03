import AWS from 'aws-sdk';
import 'react-bootstrap';
//Authentification
export default function AnonLog() {
    
    AWS.config.region = process.env.REACT_APP_LOGREGION; 
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId : process.env.REACT_APP_LOGPOOLID as string ,
    });
    
    AWS.config.getCredentials(function () {
      var accessKeyId = AWS.config.credentials?.accessKeyId;
      var secretAccessKey = AWS.config.credentials?.secretAccessKey;
      var sessionToken = AWS.config.credentials?.sessionToken;
    });
  }