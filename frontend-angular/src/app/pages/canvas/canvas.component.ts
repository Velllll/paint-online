import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, UrlTree } from '@angular/router';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit {

  @ViewChild('canvas', {static: true})
  canvas?: ElementRef<HTMLCanvasElement>
  private ctx?: CanvasRenderingContext2D | null

  thickness = 1
  color = '#000000'
  mouseDown?: boolean
  isConnect = true
  socket?: WebSocket
  name: string = ''
  roomId: string = this.router.url.slice(1)

  constructor(
    private router: Router
  ) { }

  ngOnInit () { }

  connect() {
    this.isConnect = false
    this.lisen()
    this.socket = new WebSocket('ws://localhost:5000/')

    this.socket.onopen = () => {
      this.socket?.send(JSON.stringify({
        method: 'connection',
        id: this.roomId,
        username: this.name
      }))
    }
    this.socket.onmessage = (event) => {
      const msg = JSON.parse(event.data)
      switch (msg.method) {
        case 'connection':
          console.log(`${msg.username} connected`)
          break;
        case 'draw':
          this.drowHandlerWs(msg)
          break
      }
    }
    this.socket.onclose = () => {
      console.log('ws close')
      this.notLisen()
      this.isConnect = true
    }
    this.socket.onerror = () => {
      console.log('wss error')
      this.notLisen()
      this.isConnect = true
    }
  }

  lisen() {
    this.ctx = this.canvas!.nativeElement.getContext('2d')
    this.canvas!.nativeElement.onmousemove = this.mouseMoveHandler.bind(this)
    this.canvas!.nativeElement.onmousedown = this.mouseDownHandler.bind(this)
    this.canvas!.nativeElement.onmouseup = this.mouseUpHandler.bind(this)
  }

  notLisen() {
    this.canvas!.nativeElement.onmousemove = null
    this.canvas!.nativeElement.onmousedown = null
    this.canvas!.nativeElement.onmouseup = null
  }

  mouseUpHandler(e: any) {
    this.mouseDown = false
    this.socket!.send(JSON.stringify({
      method: 'draw',
      id: this.roomId,
      coord: {
        finish: 'finish',
      }
    }))
  }

  mouseDownHandler(e: any) {
    this.mouseDown = true
    this.ctx!.beginPath()
    this.ctx!.moveTo(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop)
  }
  
  mouseMoveHandler(e: any) {
    if(this.mouseDown) {
      this.socket!.send(JSON.stringify({
        method: 'draw',
        id: this.roomId,
        coord: {
          x: e.pageX - e.target.offsetLeft,
          y: e.pageY - e.target.offsetTop,
        },
        settings: {
          thickness: this.thickness,
          color: this.color
        }
      }))
    }
  }

  drowHandlerWs(msg: any) {
    const coord = msg.coord
    if(msg.coord?.finish) this.ctx?.beginPath()
    this.ctx!.lineTo(coord.x, coord.y)
    this.ctx!.fillStyle = msg.settings?.color
    this.ctx!.strokeStyle = msg.settings?.color
    this.ctx!.lineWidth = msg.settings?.thickness
    this.ctx!.stroke()
  }
}
