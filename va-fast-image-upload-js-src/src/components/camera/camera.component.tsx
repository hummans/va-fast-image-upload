/**
 * Coded By : aigenseer
 * Copyright 2019, https://github.com/aigenseer
 */
import * as React from 'react';
import './camera.component.css';

interface Props {
  stream: object;
}

export default class Camera extends React.Component<Props, any> {

  public video: any
  public canvas: any
  public context: any
  public qr: any
  public UPDATE_INTERVAL: number
  public DEFAULT_VIDEO_SETTINGS: object
  public interval: any


  /**
   * [on props change, then will be update the stream]
   * @param  {any} nextProps
   */
  componentWillReceiveProps(nextProps: any){
    this.startDevice(nextProps.stream);
  }

  /**
   * [componentDidUpdate start startDevice after the state has change it]
   */
  componentDidMount(){
    this.startDevice(this.props.stream)
  }


  /**
   * [start to play the stream on the video element]
   * @param  {any} stream
   */
  public async startDevice(stream: any): Promise<any>{
    try {
       if(this.video != null){
          this.video.srcObject = stream
          this.video.play();
        }
    } catch(err) {
      console.error(err)
    }
  }

  public render() {
    return (
      <div className="camera">
        <video  ref={e => this.video = e} />
        <canvas style={{'display': 'none'}}  ref={e => this.canvas = e} width={640} height={480} />
      </div>
    );
  }

}
