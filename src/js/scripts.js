import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader'
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls'

const renderer = new THREE.WebGLRenderer()

renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

renderer.shadowMap.enabled = true

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
  45, 
  window.innerWidth/window.innerHeight,
  1,
  1000
)
camera.position.set(0,2,8)

const fpsControls = new FirstPersonControls(camera, renderer.domElement)
fpsControls.lookSpeed = .021
fpsControls.movementSpeed = .05

const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

const assetLoader = new GLTFLoader()
const rgbeLoader = new RGBELoader()

renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = .8

let marsModel
rgbeLoader.load('./assets/MR_INT-005_WhiteNeons_NAD.hdr', function(texture){
  texture.mapping = THREE.EquirectangularReflectionMapping
  scene.environment = texture

  assetLoader.load('./assets/mars_one_mission_base/scene.gltf', function(gltf){
    console.log('model loaded')
    const model = gltf.scene
    scene.add(model)
    marsModel = model
    marsModel.name = "mars"
  },(xhr) => {
    console.log(`Scene ${(xhr.loaded / xhr.total) * 100}% loaded`);
  },(error) => {
    console.error("An error happened", error);
  })
}, (progress)=>{
  console.log(Math.round(progress.loaded / progress.total * 100), " onHDR Progess")
})

THREE.DefaultLoadingManager.onStart = function ( url, itemsLoaded, itemsTotal ) {
	console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
};

THREE.DefaultLoadingManager.onLoad = function () {
	console.log( 'Loading Complete!');
};

THREE.DefaultLoadingManager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
	console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
};

THREE.DefaultLoadingManager.onError = function ( url ) {
	console.log( 'There was an error loading ' + url );
};

function animate(){
  fpsControls.update(.3)
  renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)

window.addEventListener('resize', function(){
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

const mousePosition = new THREE.Vector2()
window.addEventListener('mousemove', function(e){
  mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1
  mousePosition.y = - (e.clientY / window.innerHeight) * 2 + 1
})