<?php

namespace App\Http\Controllers;

use App\Models\product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('dashboard', [
            'products' => Product::latest()->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|integer|min:0',
            'category_id' => 'required|string|max:255',
            'quantity' => 'required|integer|min:0',
            'supplier' => 'required|string|max:255',
        ]);

        Product::create($data);

        return redirect()->route('dashboard')
            ->with('success', 'Product added successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(product $product)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(product $product)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, product $product)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|integer|min:0',
            'category_id' => 'required|string|max:255',
            'quantity' => 'required|integer|min:0',
            'supplier' => 'required|string|max:255',
        ]);

        $product->update($data);

        return redirect()->route('dashboard')
            ->with('success', 'Product updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(product $product)
    {
        $product->delete();

        return redirect()->route('dashboard')
            ->with('success', 'Product deleted successfully!');
    }
}
