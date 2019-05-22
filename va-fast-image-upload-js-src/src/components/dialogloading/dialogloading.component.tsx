/**
 * Coded By : aigenseer
 * Copyright 2019, https://github.com/aigenseer
 */
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import './dialogloading.component.css';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';

export interface Props {
  title: string;
  open: boolean;
}

export default class Dialogsend extends React.Component<Props, any>{

  public static defaultProps = {
    open: false
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
   * [update the state of open]
   * @type {[type]}
   */
  public componentWillReceiveProps(nextProps: any): void{
    if (nextProps.open !== this.state.open) {
      this.setState({ open: nextProps.open });
    }
  }

  /**
   * [handling to close the dialog]
   */
  public handleClose(): void{
    this.setState({ open: false });
  }


  render() {
    return (
      <Dialog
        open={this.state.open}
        onClose={this.handleClose}
        disableBackdropClick={true}
        disableEscapeKeyDown={true}
        className={'dialogsend'}
      >
        <DialogTitle>{this.props.title}</DialogTitle>
        <DialogContent className={'content'} >
          <CircularProgress />
        </DialogContent>
      </Dialog>
    );
  }

}
