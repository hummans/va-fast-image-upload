/**
 * Coded By : aigenseer
 * Copyright 2019, https://github.com/aigenseer
 */
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import './dialogimage.component.css';
import { DialogTitle } from '../dialogbar/dialogbar.component';
import { Send } from '@material-ui/icons';
import Fab from '@material-ui/core/Fab';

export interface Props {
  img: string;
  onClose(boolean: boolean): any;
}

/**
 * [slide effect function]
 * @param  {any} props
 * @return component
 */
function Transition(props: any) {
  return <Slide direction="up" {...props} />;
}

export default class DialogImage extends React.Component<Props, any>{

  public static defaultProps = {
    onClose: ()=>{}
  }

  state = {
    open: true,
  }

  /**
   * [constructor]
   * @param {any} props
   */
  constructor(props: any){
    super(props);
    this.handleClose = this.handleClose.bind(this);
  }

  /**
   * [handling for close the dialog and deliver the choice to the parent component]
   * @type {Boolean} boolean
   */
  public handleClose(boolean: boolean=false): void{
    this.setState({ open: false });
    this.props.onClose(boolean);
  }


  render() {
    return (
        <Dialog
          fullScreen
          open={this.state.open}
          onClose={()=>this.handleClose()}
          TransitionComponent={Transition}
          className={'dialogimage'}
        >
          <DialogTitle onClose={()=> this.handleClose()} >
            {window.vafastimageupload.lang.sendFoto}
          </DialogTitle>
          <div className="content" >
            <img src={this.props.img} />
          </div>
          <Fab className={'fab'} color="primary" onClick={()=> this.handleClose(true)} >
            <Send fontSize="large"/>
          </Fab>
        </Dialog>
    );
  }

}
