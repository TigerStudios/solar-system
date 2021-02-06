<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FrontendController extends Controller
{
    //
    public function __construct(){
    }

    public function index(Request $request){

        return view('frontend.shared.index');

    }

}
