import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';

// import { OBJLoader } from '../modules/objloader.js';
// import { MTLLoader } from '../modules/mttloader.js';

@Injectable()
export class ThreeService {
    m_scene = null;
    m_directionalLight = null;
    m_fog = null;
    m_renderer = null;
    m_camera = null; // object ref to camera
    m_spawnedAsset = null; // object reference to spawned 3d object
    m_mouse; // 


    // variables. 
    m_forwardRotation = false; // toggle to move animation between rotating forward and backward.
    m_rot = 0; // current object rotation

    // properties, feel free to mess with these.
    m_defaultObjectRotation = .3; // 0-1 range mapped 0-360
    m_maxObjectRotation = 0.1; // 0-1 range mapped 0-360 
    m_sensitivity = 0.1; // mouse sensitivity. 
    m_renderScale = 2; // by default 1x res produces a pixely look. feel free to mess with ths.

    init() {
        document.addEventListener('mousemove', this.onDocumentMouseMove.bind(this), false);
        window.addEventListener('resize', this.onWindowResize.bind(this), false);

        this.m_mouse = new THREE.Vector2();
        console.log(this.m_mouse);
        this.m_scene = new THREE.Scene();
        this.m_camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.setCameraPosition();
        this.initRenderer();
    }

    // camera needs to be in a position away from 0,0,0 to properly render the object.
    // all objects added to the scene are added at x:0, y:0, z:0
    private setCameraPosition() {
        this.m_camera.position.z = 8;
        this.m_camera.position.y = 3.5;
        this.m_camera.position.x = -.3;

        // angling the camera down to look at the cup (provides a nice 3/4 view.)
        this.m_camera.rotation.x = -0.3;
    }

    // setting up the main renderer. 
    private initRenderer() {
        // if you want a pixely look, turn off antialias. 
        this.m_renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.updateDisplay();
        this.m_renderer.setClearColor(0x000000, 0);
        this.m_renderer.shadowMap.enabled = true;
        var element = document.querySelector(".section-home").appendChild(this.m_renderer.domElement);
        element.className = "canvas";

        this.createScene();
    }

    private onDocumentMouseMove(event) {
        event.preventDefault();
        this.m_mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.m_mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }
    
    private onWindowResize() {
        this.updateDisplay();
    }

    private updateDisplay() {
        this.m_camera.aspect = window.innerWidth / window.innerHeight;
        this.m_camera.updateProjectionMatrix();
        this.m_renderer.setSize(window.innerWidth * this.m_renderScale, window.innerHeight * this.m_renderScale);
    }

    private createScene() {
        // Setup lights
        this.createAmbientLight();
        this.createDirectionalLight();
        // Call asset creation
        this.createAsset();
            // OnAssetCreate
                // Play Animation (loop)
    }

    // Lighting setup is simple: 1x directional, 1x ambient. 
    private createDirectionalLight() {
        this.m_fog = new THREE.Fog(0x091024, 1, 50);
        this.m_directionalLight = new THREE.DirectionalLight(0xffffff, 2.0);

        this.m_directionalLight.castShadow = true;
        this.m_scene.fog = this.m_fog;

        this.m_scene.add(this.m_directionalLight);
        this.m_directionalLight.position.z = 30;
        this.m_directionalLight.position.x = -20;
        this.m_directionalLight.position.y = 25;
    }

    private createAmbientLight() {
        var ambientLight = new THREE.AmbientLight(0x80ACD3, 0.6);
        this.m_scene.add(ambientLight);
    }

    // first we need to load the object's material. 
    private createAsset() {
        var mtlLoader = new MTLLoader();
        mtlLoader.setPath('../assets/');
        mtlLoader.load('teacupedit.mtl', this.onMaterialCreate.bind(this)); // async 
    }

    // then we load the mesh.
    private onMaterialCreate(materials) {
        console.log("material loaded")
        var objPath = '../assets/teacupedit.obj';
        var loader = new OBJLoader();
        loader.setMaterials(materials);
        loader.load(objPath, this.onAssetCreate.bind(this), this.reportAssetLoad.bind(this), this.throwError.bind(this)); // async
    }

    // once we've loaded both the material and the object, we add it to the scene. 
    private onAssetCreate(object) {
        // when we get here, we're done loading..
        this.m_spawnedAsset = this.m_scene.add(object);
        object.traverse(function (node) {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
            }
        });
        this.playAnimation();
    }

    // this function runs once per frame, as fast as the browser can render.
    private playAnimation() {
        requestAnimationFrame(this.playAnimation.bind(this));
        this.m_renderer.render(this.m_scene, this.m_camera);

        if (this.m_forwardRotation == false && this.m_rot > this.m_maxObjectRotation) {
            // console.log("forward");
            this.m_forwardRotation = true;
        }
        if (this.m_forwardRotation && this.m_rot < -this.m_maxObjectRotation) {
            // console.log("back");
            this.m_forwardRotation = false;
        }

        let speed = 0.001;

        if (this.m_forwardRotation) {
            this.m_rot -= speed;
        }
        else {
            this.m_rot += speed;
        }

        this.m_spawnedAsset.rotation.y = ((this.m_mouse.x * 0.7) * this.m_sensitivity) + this.m_defaultObjectRotation + this.m_rot;
        this.m_spawnedAsset.rotation.x = (-this.m_mouse.y * this.m_sensitivity);
    }

    private reportAssetLoad(xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    }
    
    //------------------------------------------------------------------------------
    private throwError(error) {
        console.log('An error happened: ', error);
    }

}