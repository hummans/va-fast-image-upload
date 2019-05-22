/**
 * Coded By : aigenseer
 * Copyright 2019, https://github.com/aigenseer
 */
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import './dialogcamera.component.css';
import Dialogmsg from '../dialogmsg/dialogmsg.component';
import VideoStream from '../../lib/videoStream';
import CameraComponent from '../camera/camera.component';
import DialogImage from '../dialogimage/dialogimage.component';
import Button from '@material-ui/core/Button';
import { CameraFront, Camera } from '@material-ui/icons';
import Dialogselect from '../dialogselect/dialogselect.component';
import { DialogTitle, DialogActions } from '../dialogbar/dialogbar.component';
import MuiDialogTitle from '@material-ui/core/DialogTitle';


export interface Props {
  open: boolean;
  onClose(img: null|string): any;
}

interface StateLayout {
    stream: object|null;
    open: boolean;
    showDialogActions: boolean;
    showSelectDialog: boolean;
    img: any;
    msg: any;
}

/**
 * [slide effect function]
 * @param  {any} props
 * @return component
 */
function Transition(props: any) {
  return <Slide direction="up" {...props} />;
}

export default class Dialogcamera extends React.Component<Props, any>{

  public static defaultProps = {
    open: false,
    onClose: ()=>{}
  }

  state: StateLayout = {
    stream: null,
    open: false,
    msg: null,
    showDialogActions: true,
    showSelectDialog: false,
    img: null,
  }

  private cameraRef: any
  private devices: Array<any> = []
  private selectDeviceId: string|null = null;
  private videoStream: any = new VideoStream()

  /**
   * [constructor]
   * @param {any} props
   */
  constructor(props: any){
    super(props);
    this.handleClose = this.handleClose.bind(this);
    this.state.open = this.props.open;
    this.cameraRef = React.createRef();
    this.handleChanceSelect = this.handleChanceSelect.bind(this);
    this.onSelectDeviceId = this.onSelectDeviceId.bind(this);
    this.onCloseDialogImage = this.onCloseDialogImage.bind(this);
  }

  /**
   * [start the dialog to create a stream]
   */
  componentWillMount(): void{
    this.initStream();
  }

  /**
   * [on component try to open then start the dialog to create a stream]
   * @param  {any} nextProps
   */
  componentWillReceiveProps(nextProps: any): void{
    if (nextProps.open) {
      this.initStream();
    }
  }

  /**
   * [on unmount close the tracks from streams]
   */
  componentWillUnmount(): void{
    this.videoStream.close();
  }

  /**
   * [handling function to close the dialog]
   */
  public handleClose(): void{
    this.setState({ open: false });
    this.props.onClose(null);
  }

  /**
   * [chance the stream]
   * @type {string|null} deviceId [if the paramenter are NOT null, then the option to create the stream are the default options]
   */
  private setStream(deviceId: string|null = null): Promise<object>{
    return new Promise((resolve: any, reject: any) => {
      let option = undefined;
      if(deviceId!=null){
        option = { deviceId: { exact: deviceId } }
      }
      this.selectDeviceId = deviceId;
      this.videoStream.getStream(option).then((stream: any) => {
        resolve(stream);
      }).catch(reject);
    })
  }

  /**
   * [dialog to create the stream]
   */
  private initStream(): void{
    if(this.state.stream!=null){
      this.setState({ msg: null, open: true })
    }else{
      this.setState({
        msg: <Dialog
          open={true}
          disableBackdropClick={true}
          disableEscapeKeyDown={true}
          className={'dialogwaitpermission'}
        ><MuiDialogTitle>{window.vafastimageupload.lang.titleWaitPermission}</MuiDialogTitle></Dialog>
      })
      this.videoStream.getDevices().then((devices: Array<any>) =>{
        this.devices = devices;
        this.setStream().then((stream: object)=>{
          this.setState((state: any) => {
            state.stream = stream;
            state.msg = null;
            state.open = true;
            if(this.devices.length==1){
              state.showDialogActions = false
            }
            return state;
          })
        }).catch((err: any) => {
          console.log(err, err.message);
          this.setState({ open: false, msg: <Dialogmsg title={window.vafastimageupload.lang.titlePermissonFailed} text={window.vafastimageupload.lang.contentPermissonFailed} onClose={()=> this.handleClose()} /> })
        })
      }).catch(console.error);
    }
  }

  /**
   * [create the dataUrl from the video element]
   */
  public createImage(): void{
    let canvas = document.createElement('canvas');
    canvas.height = this.cameraRef.current.video.videoHeight;
    canvas.width = this.cameraRef.current.video.videoWidth;
    let ctx = canvas.getContext('2d');
    ctx.drawImage(this.cameraRef.current.video, 0, 0, canvas.width, canvas.height);
    this.setState({img: canvas.toDataURL()})
  }

  /**
   * [handling event to close the image component]
   * @type {Boolean} boolean
   */
  public onCloseDialogImage(boolean: boolean=false): void{
    this.props.onClose(boolean? this.state.img: null);
    this.setState({img: null})
  }

  /**
   * [handling function on select a stream interface]
   * @type {any} item
   */
  public onSelectDeviceId(item: any): void{
    this.setStream(item.deviceId).then((stream: object)=>{
      this.setState({stream: stream, showSelectDialog: false})
    });
  }

  /**
   * [handling function to chance the stream interface]
   */
  public handleChanceSelect(): void{
    switch(this.devices.length){
      case 2:
        this.setStream(this.devices.filter((device: any) => device.deviceId!==this.selectDeviceId)[0].deviceId).then((stream: object)=>{
          this.setState({stream: stream})
        });
      break;
      default:
        this.setState({ showSelectDialog: true })
      break;
    }
  }

  render() {
    if(this.state.msg){
      return this.state.msg
    }

    if(this.state.img != null){
      return (<DialogImage img={this.state.img} onClose={this.onCloseDialogImage} />)
    }

    const ActionFooter = !this.state.showDialogActions? null: (<Button onClick={this.handleChanceSelect} color="primary" className="change-camera">
      <CameraFront fontSize="large" />
    </Button>);

    let DialogSelectJSX = null;
    if(this.state.showSelectDialog){
      let options = this.devices.map(e => ({ title: e.label.replace(/ (\(.*?\))/g, ''), deviceId: e.deviceId, selected: this.selectDeviceId == e.deviceId }))
      DialogSelectJSX = (<Dialogselect open={true} title={window.vafastimageupload.lang.titleSelectDevice} options={options} onSelect={this.onSelectDeviceId} />)
    }

    return (
        <Dialog
          fullScreen
          open={this.state.open}
          onClose={()=>this.handleClose()}
          TransitionComponent={Transition}
          className={'dialogcamera'}
        >
          <DialogTitle onClose={()=>this.handleClose()} >
            {window.vafastimageupload.lang.takeFoto}
          </DialogTitle>
          <div className="content" >
            <CameraComponent ref={this.cameraRef} stream={this.state.stream}/>
          </div>
          {DialogSelectJSX}
          <DialogActions className={'dialog-actions'} >
            {ActionFooter}
            <Button color="primary" >
              <Camera fontSize="large" className={'camera-button'} onClick={()=>this.createImage()} />
            </Button>
          </DialogActions>
        </Dialog>
    );
  }

}
