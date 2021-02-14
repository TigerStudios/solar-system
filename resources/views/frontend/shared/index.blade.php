@extends('frontend.shared.interface')
@section('content')
    <div class="row" id="system-box" data-asset="{{asset('')}}">

            <!--Loader-->
        <div class="ts-grid-fixed ts-bg-black" id="loader">
            <div class="ts-grid-fixed self-centered box">
                <div class="col-pp-12 inner" id="load-button">
                    <img alt="img" src="{{asset('assets/images/frontend/load.png')}}" class="center-img">
                </div>
                <div class="col-pp-12 ts-font-elegance overflow-visible text">
                    CLICK TO LOAD
                </div>
            </div>
            <div class="col-pp-12" id="load-bar"></div>
        </div>
            <!--Loader-->

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

            _('#load-button').click((e) => {

                _('#loader .box').dispose();

                jTS.jAnimate(2000,(progress) => {

                    let width = `${100 * progress}%` ;
                    _('#load-bar').css('width',width);

                },{

                    callback : () => {

                        jTS.jAnimate(1000,(progress) => {

                            _('#loader').css('opacity',progress);

                        }, {

                            reverse : true,
                            callback : () => {

                                _('#loader').dispose();
                                _(window).emits('LOADER_GONE');

                            }

                        })

                    }

                });



            });

        });

        _(() => {

            const app = new App(THREE,TWEEN,ORBIT_CONTROLS,_('#system-box').attr('data-asset'));

        });

    </script>
@endsection
