/**
 * Coded By : aigenseer
 * Copyright 2019, https://github.com/aigenseer
 */
import * as React from "react";
import Dialogcamera from '../dialogcamera/dialogcamera.component';
import Dialogloading from '../dialogloading/dialogloading.component';
import DialogMsg from '../dialogmsg/dialogmsg.component';
import Dialogfileupload from '../dialogfileupload/dialogfileupload.component';
import Button from '@material-ui/core/Button';
import moment from 'moment';
import Dialogchoice from '../dialogchoice/dialogchoice.component';
import cyan from '@material-ui/core/colors/cyan';
import lightBlue from '@material-ui/core/colors/lightBlue';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { PhotoCamera } from '@material-ui/icons';
import fingerprint2 from 'fingerprintjs2';


const theme = createMuiTheme({
  palette: {
    primary: cyan,
    secondary: lightBlue
  },
  typography: {
    useNextVariants: true,
  }
});


export interface AppProps { compiler: string; framework: string; }

interface StateLayout {
    loading: boolean;
    msg: string;
    choice: {
      open: boolean;
      value: null|string;
    }
}

export default class App extends React.Component<AppProps, {}> {

    state: StateLayout = {
      loading: false,
      msg: null,
      choice: {
        open: false,
        value: null
      }
    }

    /**
    * [constructor]
    * @param {Unkown} props
    */
    constructor(props: any){
      super(props);
      this.onDialogClose = this.onDialogClose.bind(this);
      this.openDialog = this.openDialog.bind(this);
      this.onChoice = this.onChoice.bind(this);
    }

    /**
     * [on mount create eventListener for the element with the window.vafastimageupload.app_name-open class]
     */
    componentDidMount(): void{
      let buttons = document.getElementsByClassName(window.vafastimageupload.app_name+'-open');
      for (let i = 0; i < buttons.length; i++) {
          buttons[i].addEventListener("click", this.openDialog);
      }
    }


    /**
     * [deliver the fingerprint hash]
     * @return {Promise} String
     */
    public getFingerprint(): Promise<string>{
      return new Promise((resolve, reject) => {
        try {
          fingerprint2.get((components: any) => {
            let values = components.map((component:any) => component.value )
            resolve(fingerprint2.x64hash128(values.join(''), 31));
          })
        } catch(err){
          reject(err);
        }
      });
    }

    /**
     * [send the dataUrl to the server]
     * @type {String} dataUrl
     * @return {Promise} any
     */
    public sendData(dataUrl: string): Promise<any>{
      return new Promise((resolve, reject) => {
        fetch(dataUrl)
        .then(res => res.blob())
        .then(blob => {
          this.getFingerprint().then((fingerprint: string)=>{
            let url = window.vafastimageupload.settings.uploadUrl.replace('%FINGERPRINT', fingerprint);
            let formData = new FormData();
            let extension = blob.type.split('/').length>0? blob.type.split('/')[1]: 'png';
            // formData.append('fingerprint', fingerprint);
            formData.append(window.vafastimageupload.app_name, blob, moment().format('YYYY-MM-DD_HH-mm-ss')+'.'+extension);
            let request = new XMLHttpRequest();
            request.open("POST", url);
            request.onload = () => {
              if (request.status == 200) {
                // console.log("Uploaded", request.responseText)
                resolve();
              } else {
                reject(JSON.parse(request.response));
              }
            };
            request.send(formData);
          }).catch(reject);
        }).catch(reject)
      })
    }


    /**
     * [open the dialog for choice the interface action for the user
     * if the setting disableTakePhoto is false or the protocol are not https, then the user can only upload some file]
     */
    public openDialog(): void{
      this.setState((state: any) => {
         if(window.vafastimageupload.settings.disableTakePhoto || location.protocol != 'https:'){
           state.choice.value = 'upload';
         }else{
           state.choice.open = true;
         }
         return state;
      });
    }

    /**
     * [handling function to colse the dialog
     *  if the dataUrl is not null, then open the loading dialog
     *  if the sendData throw a error, than will be display the error with the DialogMsg
     *  ]
     * @type {null|string} dataUrl
     */
    public onDialogClose(dataUrl: null|string): void{
      this.setState((state: any) => {
        if(dataUrl!=null){
          state.loading = true;
          state.choice.value = null;
        }else{
          state.choice = {
            open: false,
            value: null
          };
        }
        return state
      });
      if(dataUrl!=null){
        this.sendData(dataUrl).then(()=>{
          this.setState({loading: false});
        }).catch((error: any) =>{
          this.setState({loading: false, msg: <DialogMsg title={error.code} text={error.message} onClose={()=>{ this.setState({ msg: null }) }} />});
        });
      }
    }


    /**
     * [handling function for choice the interface action]
     * @type {null|string} value
     */
    public onChoice(value: null|string){
      this.setState((state: any) => {
         state.choice.value = value;
         state.choice.open = false;
         return state;
      });
    }

    public render() {
      let { loading, choice } = this.state;
      let content = null;
      if(choice.open){
        content = (<Dialogchoice onChoice={this.onChoice} />)
      }else if(loading) {
        content = (<Dialogloading title={window.vafastimageupload.lang.sendData} open={true} />)
      } else {
        if(choice.value == 'camera'){
          content = <Dialogcamera open={true} onClose={this.onDialogClose} />
        }else if(choice.value == 'upload'){
          content = <Dialogfileupload onClose={this.onDialogClose} />
        }
      }
      let button = (<Button variant="contained" color="primary" onClick={this.openDialog}>
        {window.vafastimageupload.lang.screenButtonTitle} <PhotoCamera fontSize="large" />
      </Button>)
      if(window.vafastimageupload.settings.disableButton){
        button = null
      }
      return (
        <div className="App">
            <MuiThemeProvider theme={theme}>
              {this.state.msg}
              {button}
              {content}
            </MuiThemeProvider>
        </div>
      );
    }
}
