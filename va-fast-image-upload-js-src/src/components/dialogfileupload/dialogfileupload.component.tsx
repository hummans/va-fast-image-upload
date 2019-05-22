/**
 * Coded By : aigenseer
 * Copyright 2019, https://github.com/aigenseer
 */
import React from 'react';
import DialogImage from '../dialogimage/dialogimage.component';

export interface Props {
  onClose(img: null|string): any;
}

interface StateLayout {
    img: null|string;
}

export default class Dialogfileupload extends React.Component<Props, any>{

  state: StateLayout = {
    img: null
  }

  public input: any;

  /**
   * [constructor]
   * @param {Object} props
   */
  constructor(props: any){
    super(props);
    this.onChanceFile = this.onChanceFile.bind(this);
    this.onCloseDialogImage = this.onCloseDialogImage.bind(this);
    this.input = React.createRef();
  }

  /**
   * [on did mount, then fire the click event from input element to start the file handling]
   */
  componentDidMount(){
    this.input.current.click();
  }

  /**
   * [on props chance, then fire the click event from input element to start the file handling]
   */
  componentWillReceiveProps(){
    if(this.input.current!=null){
      this.input.current.click();
    }
  }

  /**
   * [handler for chance input element]
   * @type {any} e
   */
  public onChanceFile(e: any): void{
    const files = Array.from(e.target.files);
    if(files.length>0){
      let reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = () => {
         this.setState({img: reader.result})
      };
    }else{
      this.props.onClose(null);
    }
  }

  /**
   * [handler to close the DialogImage]
   * @type {Boolean} boolean
   */
  public onCloseDialogImage(boolean: boolean=false): void{
    this.props.onClose(boolean? this.state.img: null);
    this.setState({img: null})
  }


  render() {
    if(this.state.img!=null) return (<DialogImage img={this.state.img} onClose={this.onCloseDialogImage} />)
    return (
      <div>
        <input type="file" accept="image/*" ref={this.input} onChange={this.onChanceFile} style={{display: 'none'}} />
      </div>
    );
  }

}
