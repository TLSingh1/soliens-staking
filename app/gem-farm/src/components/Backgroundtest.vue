<template>
  <canvas class="webgl"></canvas>
</template>
<script>
import * as Three from 'three'

export default {
  name: 'warpDrive',
  data() {
    return {
      camera: null,
      scene: null,
      renderer: null,
      mesh: null
    }
  },
  methods: {
    init: function() {
        const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Warp Drive
 */
 const parameters = {}
 parameters.count = 1000
 parameters.speed = 1
 parameters.radius = 100
 parameters.distance = 100
 parameters.size = 0.1


 let geometry = null
 let geometry2 = null
 let material = null
 let points = null
 let points2 = null
 const warpDrive = () => {
    geometry = new THREE.BufferGeometry()
    geometry2 = new THREE.BufferGeometry()



     const positions = new Float32Array(parameters.count * 3)
     const positions2 = new Float32Array(parameters.count * 3)

     const colors = new Float32Array(parameters.count * 3)
     const colors2 = new Float32Array(parameters.count * 3)





     for(let i = 0; i < parameters.count; i++) {
         const i3 = i * 3

         const randomX = (Math.random() - 0.5) * parameters.radius
         const randomY = (Math.random() - 0.5) * parameters.radius
         const randomZ = - Math.random() * parameters.distance / 2
         const randomZ2 = - Math.random() * parameters.distance / 2 - parameters.distance / 2

         positions[i3    ] = randomX
         positions[i3 + 1] = randomY
         positions[i3 + 2] = randomZ

         positions2[i3    ] = randomX
         positions2[i3 + 1] = randomY
         positions2[i3 + 2] = randomZ2

         colors[i3    ] = 1
         colors[i3 + 1] = 1
         colors[i3 + 2] = 1

         colors2[i3    ] = 1
         colors2[i3 + 1] = 1
         colors2[i3 + 2] = 1
     }

     geometry.setAttribute(
         'position',
         new THREE.BufferAttribute(positions, 3)
     )

     geometry2.setAttribute(
        'position',
        new THREE.BufferAttribute(positions2, 3)
    )

    geometry.setAttribute(
        'color',
        new THREE.BufferAttribute(colors, 3)
    )

    geometry2.setAttribute(
        'color',
        new THREE.BufferAttribute(colors2, 3)
    )


    /**
      * Material
      */
     material = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
    })

    /**
     * Points
     */
    points = new THREE.Points(geometry, material)
    points2 = new THREE.Points(geometry2, material)
    scene.add(points)
    scene.add(points2)
}
warpDrive()
// Objects
// const geometry = new THREE.TorusGeometry( .7, .2, 16, 100 );

// Materials

// const material = new THREE.MeshBasicMaterial()
// material.color = new THREE.Color(0xff0000)

// Mesh
// const sphere = new THREE.Mesh(geometry,material)
// scene.add(sphere)

// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)
scene.fog = new THREE.FogExp2( 0x000000, 0.02 )

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

document.addEventListener('mousemove', onDocumentMouseMove)

let mouseX = 0
let mouseY = 0

function onDocumentMouseMove(event) {
    mouseX = event.clientX - window.innerWidth / 2
    mouseY = - (event.clientY - window.innerHeight / 2)
}
const clock = new THREE.Clock()


    },
    animate: function() {
        requestAnimationFrame(this.animate);
        const elapsedTime = clock.getElapsedTime()

    // Update objects
    //camera.position.z -= 0.1
    //console.log(parameters.distance)
    // if (camera.position.z > - parameters.distance / 2) {
    //      camera.position.z -= 0.1
    // } else {
    //      camera.position.z = 2
    // }
    if (points.position.z < parameters.distance / 2 ) {
        points.position.z += .1 * parameters.speed
   } else {
        points.position.z = - parameters.distance / 2
   }
   if (points2.position.z < parameters.distance ) {
        points2.position.z += .1 * parameters.speed
   } else {
        points2.position.z = 0
   }

   camera.rotation.y = - mouseX / 4000
   camera.rotation.x = mouseY / 4000
   console.log(sizes.height)


    

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)
    }
  },
  mounted() {
      this.init();
      this.animate();
  }
}

</script>
<style>
.webgl
{
    position: fixed;
    top: 0;
    left: 0;
    outline: none;
    overflow-y: scroll;
    z-index: 50;
}
</style>