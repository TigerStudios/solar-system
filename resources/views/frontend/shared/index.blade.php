@extends('frontend.shared.interface')
@section('content')
    <div class="row" id="system-box" data-asset="{{asset('')}}">

            <!--3d stage-->
        <div class="col-pp-12" id="system-stage"></div>
            <!--3d stage-->

            <!--2d interface-->
        <div class="col-pp-12" id="interface-box"></div>
            <!--2d interface-->

    </div>
@endsection
@section('scripts')
    <script type="module">

        import * as THREE from './assets/vendor/three/build/three.module.js';
        import {TWEEN} from './assets/vendor/three/examples/jsm/libs/tween.module.min.js';
        import { OrbitControls as ORBIT_CONTROLS} from './assets/vendor/three/examples/jsm/controls/OrbitControls.js';

        _(() => {

            const app = new App(THREE,TWEEN,ORBIT_CONTROLS,_('#system-box').attr('data-asset'));

        });

    </script>
@endsection