import React, { Component } from "react";
import * as THREE from "three";
// import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './mainpage.module.css';


class MainPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        this.updateDimensions = this.updateDimensions.bind(this);
        this.start = this.start.bind(this);
    }

    async componentDidMount() {

        const width = this.state.width;
        const height = this.state.height;
        this.scene = new THREE.Scene();
        this.setState({ mouse: new THREE.Vector2() });

        //Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setClearColor("#12151a");
        this.renderer.setSize(width, height);
        this.mount.appendChild(this.renderer.domElement);

        //Camera
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.camera.position.y = 40;
        this.camera.position.z = -62;

        //Lights
        var lights = [];
        lights[0] = new THREE.PointLight(0x304ffe, 1, 0);
        lights[1] = new THREE.PointLight(0xffffff, 1, 0);
        lights[2] = new THREE.PointLight(0xffffff, 1, 0);
        lights[0].position.set(0, 200, 0);
        lights[1].position.set(100, 200, 100);
        lights[2].position.set(-100, -200, -100);
        this.scene.add(lights[0]);
        this.scene.add(lights[1]);
        this.scene.add(lights[2]);

        //3D Models
        const vertices = [];
        this.theta = 0;

        this.SEPARATION = 15;

        for (let ix = 0; ix < this.state.width; ix++) {
            for (let iz = 0; iz < this.state.height; iz++) {
                const x = ix * this.SEPARATION - ((this.state.width * this.SEPARATION) / 2)
                const y = 20*(Math.cos(ix / this.state.width * 90) + Math.sin((iz / this.state.height * 90)))
                const z = iz * this.SEPARATION - ((this.state.height * this.SEPARATION) / 2)
                vertices.push( x, y, z );
            }
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
        let material = new THREE.PointsMaterial( { color: "#f8adff" } );
        this.points = new THREE.Points( geometry, material );
        this.scene.add( this.points );

        this.renderScene();
        //start animation
        this.start();
        // adjust scene on window resize
        window.addEventListener('resize', this.updateDimensions);
    }

    start = () => {
        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this.animate);
        }
    };

    updateDimensions = () => {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    };

    renderScene = () => {
        if (this.renderer) this.renderer.render(this.scene, this.camera);
    };

    animate = () => {
        let index = 1
        this.theta += 0.009

        for (let ix = 0; ix < this.state.width; ix++) {
            for (let iz = 0; iz < this.state.height; iz++) {
                this.points.geometry.getAttribute('position').array[index] =
                    30*(Math.cos(ix / this.state.width * 90 + this.theta) + Math.sin((iz / this.state.height * 90 + this.theta)))
                index+=3;
            }
        }
        this.points.geometry.getAttribute('position').needsUpdate = true;
        this.renderScene();
        this.frameId = window.requestAnimationFrame(this.animate);

    };

    render() {
        return (
            <div className="App">
                <div ref={mount => {
                    this.mount = mount
                }}>
                </div>
                <h2 className={`${styles.teaser}`}>The first NFT Bridge between Tezos & Ethereum</h2>
            </div>
        );
    }
}
export default MainPage;
