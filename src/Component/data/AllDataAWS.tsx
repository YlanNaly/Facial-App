import AWS from "aws-sdk";
import { useState } from "react";
import { Form } from "react-bootstrap";
import AnonLog from "./AwsLog";
import '../Css/AllDataAWS.css';
import TableData from "./AwsDataTable";
import Loader from "./Loader";
export default function AWSData() {

  const [image,setImage] = useState<string>();
  const [dataAws,setDataAws] = useState<any>([])
  const [load,setLoad] = useState<boolean>(false);
  const [Emotion,setEmotion] = useState<any>([]);
  const [LandMarks,setLandMarks] = useState<any>([]);

//Les infos sur l'image
function Faces(imageData: any , callback:(props : any)=> void ) {

    var rekognition = new AWS.Rekognition();
       var params:any = {
         Image: {
           Bytes: imageData
         },
         Attributes: [
           'ALL',
         ]
       };
   
      rekognition.detectFaces(params ,function (err , data:any) {
   
         if (data != null){
          console.log(data.FaceDetails)
          setDataAws(data.FaceDetails[0])
          setEmotion(data.FaceDetails[0].Emotions)
          setLandMarks(data.FaceDetails[0].Landmarks)
         } 
         else {
             console.log(err); // an error occurred
         }
       });
    } 
//change l'image en base64 code
const changeImage = (e : any)=>{
      setImage(URL.createObjectURL(e.target.files[0]))
  }
//etudie l'image
const ProcessImage = (e :any)=> {
    AnonLog();
    changeImage(e);
    var file =  e.target.files[0];
    var reader: any = new FileReader();
    reader.onload = (function (e){
      return function (e:any){
        var image:any = null;
        var jpg = true;
        try {
          image = atob(e.target.result.split("data:image/jpeg;base64,")[1]);
        } catch (e) {
          jpg = false;
          setImage("Image.png")
        }
        if (jpg === false) {
          try {
            image = atob(e.target.result.split("data:image/png;base64,")[1]);
            console.log("ok png")
          } catch (e) {
            alert("Not an image file Rekognition can process");
            return;
          }
        }
        //unencode image bytes for Rekognition DetectFaces API 
        var length = image.length;
        var imageBytes = new ArrayBuffer(length);
        var ua = new Uint8Array(imageBytes);
        for (var i = 0; i < length; i++) {
          ua[i] = image.charCodeAt(i);
        }
        Faces(imageBytes, ()=>{});
      };
    })(file);
    reader.readAsDataURL(file);
}

return (
<>
  <div className="row">
    <div className="card">
        <Form.Group controlId="formFileDisabled" className="mb-3" onChange={ProcessImage} >
          <Form.Control type="file"/>
        </Form.Group>
          <div className="card-body">
            <img src={image} style={{width : "100%" , marginLeft:"2%"}} onChange={()=>setLoad(true)} ></img>      
          </div>
    </div>
    <div className="card-body-2" >
        <h1>Result</h1>
        { 
      image != null && dataAws === null ?  
        <Loader/> :   
      Object.keys(dataAws).map((e :any , index :number)=>(
        <TableData key={index} dataTitle={
        dataAws!= null ?  e : null
        } 
        dataValue={JSON.stringify(
          dataAws[e].Low != null   ? "Low : "+dataAws[e].Low :
          dataAws[e].Value != null ? "Value : "+dataAws[e].Value : 
          dataAws[e].Width != null ? "Width : "+ dataAws[e].Width:
          dataAws[e].Pitch != null ? "Pitch : "+dataAws[e].Pitch : 
          dataAws[e].Brightness != null ? "Brightness : "+dataAws[e].Brightness : dataAws.Value
        )}
        dataConfidence={JSON.stringify(
          dataAws[e].High!= null ? "High : " +dataAws[e].High :
          dataAws[e].Confidence ? "Confidence : "+ dataAws[e].Confidence : 
          dataAws[e].Roll != null ? "Roll : "+dataAws[e].Roll :
          dataAws[e].Height != null ? "Height : "+dataAws[e].Height : 
          dataAws[e].Sharpness != null ? "Sharpness : "+dataAws[e].Sharpness : dataAws.Confidence
          )}
          dataEmotions2={JSON.stringify(
            dataAws[e].Top != null ? "Top : "+dataAws[e].Top : 
            dataAws[e].Yaw != null ? "Yaw : "+dataAws[e].Yaw : Emotion.Type
          )}
          dataEmotions3={JSON.stringify(
            dataAws[e].Left != null ? "Left : "+dataAws[e].Left : LandMarks.X
          )}
        />  
        ))       
        } 
      {
        Object.keys(Emotion).map((e:any , index:number)=>(
          <TableData key={index} dataTitle="Emotions" dataConfidence={JSON.stringify(Emotion[e].Confidence)} dataEmotions2={JSON.stringify(Emotion[e].Type)} />
        ))
      }  
    </div>
  </div>
</>
)


}
