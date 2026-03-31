<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Désactiver temporairement les contraintes FK
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Product::truncate(); // vider la table products
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        Product::create([
            'title' => 'Lenovo ThinkPad E490 20N8',
            'description' => 'Lenovo ThinkPad E490 20N8 - Intel Core i5 - 8265U / up to 3.9 GHz - Win 10 Pro 64-bit - UHD Graphics - 8 GB RAM - 256 GB SSD NVMe - 14" IPS 1920 x 1080 (Full HD) - Gigabit Ethernet - Wi-Fi 5 - black - kbd: US',
            'price' => 841.65,
            'image' => 'storage/products/lenovo.webp'
        ]);

        Product::create([
            'title' => 'Windows 11 Laptop',
            'description' => 'RNRUO 15.6" Windows 11 Laptop, Dual 8GB RAM, 256GB SSD, AMD 3020e Processor with 2 Cores Up to 2.6GHz, With Office 2024, 1920x1080 Display WiFi5 BT5.0 for Student, Home Office, Business',
            'price' =>  199.39,
            'image' => 'storage/products/RNRUO.webp'
        ]);
        Product::create([
            'title' => 'Hp lap top',
            'description'=>'Windows 11 Pro Laptop 15.6inch, 12GB RAM 512GB SSD, 12th Gen Intel N100 Processor, 1920x1080, Webacm',
            'price'=>  299.89 ,
            'image'=>'storage/products/hp.webp'
        ]);
        Product::create([
            'title' => 'Jumper Laptop',
            'description'=>'Jumper 17.6" Windows 11 Laptop, 16GB DDR4 640GB Storage Laptop Computer, 4-Core Intel N95 Processor(Up to 3.4GHz), 100% sRGB, Backlit Keyboard, 1yr Office 365 Free, Black',
            'price'=>  399.89 ,
            'image'=>'storage/products/Jumper.webp'
        ]);
        Product::create([
            'title' => 'HP Essential 17t Laptop',
            'description'=>'HP Essential 17t Laptop, 17.3" HD + Touchscreen 60Hz, Intel Core i7-1355U, Intel Iris Xe Graphics, 16GB RAM, 2TB SSD, Webcam, Fingerprint Reader, Wi-Fi 6, Backlit KB, Windows 11 Home, Silver',
            'price'=>  879.89 ,
            'image'=>'storage/products/HP-pro.webp'
        ]);
        // liste
        Product::create([
            'title' => 'PC Portable Copilot+ HP OmniBook 5 16-bf0008nf',
            'description'=>'Windows 11 FamilleSnapdragon® X X1-26-10016 Go RAM512 Go Disque SSD16 2K OLED, 0.2 MS Temps de réponseCarte graphique Qualcomm® Adreno™',
            'price'=>  749.00 ,
            'image'=>'storage/products/hp-omnibook.jpg'
        ]);
        Product::create([
            'title' => 'Ordinateur portable HP 250R 15,6 pouces G9',
            'description'=>'Windows 11 FamilleSnapdragon® X X1-26-10016 Go RAM512 Go Disque SSD16 2K OLED, 0.2 MS Temps de réponseCarte graphique Qualcomm® Adreno™',
            'price'=>  1049.66 ,
            'image'=>'storage/products/ordinateur.jpg'
        ]);
        Product::create([
            'title' => 'PC Portable HP OmniBook 5 16-ba1015nf',
            'description'=>'Windows 11 FamilleIntel® Core™ i7 16 Go RAM1 To Disque SSD16 2KCarte graphique Intel® Iris® Xᵉ',
            'price'=>  999.00 ,
            'image'=>'storage/products/omnibook.jpg'
        ]);
        Product::create([
            'title' => 'PC Portable Professionnel HP ProBook 460 G11 16 - Garantie 3 ans incluse',
            'description'=>'Windows 11 ProfessionnelIntel® Core™ Ultra 5 125H16 Go RAM512 Go Disque SSD 40,6 cm (16 pouces) WUXGA (1920 x 1200)Carte graphique Intel® Arc™',
            'price'=>  1277.94 ,
            'image'=>'storage/products/probook.jpg'
        ]);
        Product::create([
            'title' => 'PC Portable Copilot+ HP OmniBook 5 14-he0013nf',
            'description'=>'Windows 11 FamilleSnapdragon® X X1-26-10016 Go RAM512 Go Disque SSD14 2K OLED, 0.2 MS Temps de réponseCarte graphique Qualcomm® Adreno™',
            'price'=>  799.00 ,
            'image'=>'storage/products/13nf.jpg'
        ]);
        Product::create([
            'title' => 'PC Portable Professionnel HP ProBook 4 G1iR 14',
            'description'=>'Windows 11 FamilleSnapdragon® X X1-26-10016 Go RAM512 Go Disque SSD14" 2K OLED, 0.2 MS Temps de réponseCarte graphique Qualcomm® Adreno™',
            'price'=>  1283.52 ,
            'image'=>'storage/products/probook4.jpg'
        ]);
        Product::create([
            'title' => 'PC Portable Professionnel HP ProBook 465 G11 16 - Extension de garantie 3 ans incluse',
            'description'=>'Windows 11 ProfessionnelAMD Ryzen™ 5 7535U16 Go RAM512 Go Disque SSD16" WUXGACarte graphique AMD Radeon™ 660M',
            'price'=>  1405.82 ,
            'image'=>'storage/products/incluse.jpg'
        ]);
        Product::create([
            'title' => 'PC Portable Professionnel HP ProBook 4 G1iR 16',
            'description'=>'Windows 11 ProfessionnelAMD Ryzen™ 5 7535U16 Go RAM512 Go Disque SSD16" WUXGACarte graphique AMD Radeon™ 660M',
            'price'=>  1290.57 ,
            'image'=>'storage/products/pcportable.jpg'
        ]);
        // liste 2
        Product::create([
            'title' => 'PC Portable HP ProBook 460 G11 16',
            'description'=>'Puissance et élégance réunies. Profitez de performances exceptionnelles avec l"Intel® Core™ Ultra 5, 16 Go de RAM et un écran WUXGA 16 Windows 11 Famille - HP recommande Windows 11 Professionnel pour les entreprisesIntel® Core™ Ultra 5 125U16 Go RAM512 Go Disque SSD16 WUXGACarte graphique Intel®',
            'price'=>  1221.77 ,
            'image'=>'storage/products/460.jpg'
        ]);
        Product::create([
            'title' => "PC Portable Copilot+ HP EliteBook 6 G1a - 3 ans d'extension de garantie incluse",
            'description'=>'Windows 11 ProfessionnelAMD Ryzen™ 5 7535U16 Go RAM512 Go Disque SSD16" WUXGACarte graphique AMD Radeon™ 660M',
            'price'=>  1910.57 ,
            'image'=>'storage/products/copilot.jpg'
        ]);
        Product::create([
            'title' => "PC Portable Copilot+ HP OmniBook 7 17-dc0002nf",
            'description'=>'Windows 11 FamilleIntel® Core™ Ultra 5 226V16 Go de RAM1 To Disque SSD17.3" FHD Écran tactileCarte graphique Intel® Arc™ 130V (8 Go)',
            'price'=>  949.45 ,
            'image'=>'storage/products/717.jpg'
        ]);
        Product::create([
            'title' => "Ordinateur portable HP 250R 15,6 pouces G9",
            'description'=>'Windows 11 FamilleIntel® Core™ Ultra 7 258V32 Go RAM1 To Disque SSD17.3" FHD Écran tactileCarte graphique Intel® Arc™ 140V (8 Go)',
            'price'=>  1436.25 ,
            'image'=>'storage/products/TTC.jpg'
        ]);
        Product::create([
            'title' => "PC portable professionnel Copilot+ HP EliteBook 6 G1q",
            'description'=>'Windows 11 ProfessionnelSnapdragon® X X1-26-10016 Go RAM512 Go Disque SSD14" WUXGACarte graphique Qualcomm® Adreno™',
            'price'=>  1612.25 ,
            'image'=>'storage/products/pouces.jpg'
        ]);
        Product::create([
            'title' => "PC Portable Copilot+ HP OmniBook 7 17-dc0000nf",
            'description'=>'Windows 11 FamilleIntel® Core™ Ultra 7 258V32 Go RAM2 To Disque SSD17.3" FHD Écran tactileNVIDIA® GeForce RTX™ 4050 (6 Go)',
            'price'=>  1499.25 ,
            'image'=>'storage/products/nf.jpg'
        ]);
        Product::create([
            'title' => "Station de travail portable Copilot+ HP ZBook Ultra G1a - AMD Radeon™ 8050S et 3 ans dextension de garantie incluse",
            'description'=>'Windows 11 ProfessionnelAMD Ryzen™ AI Max PRO 38532 Go RAM1 To Disque SSD14 WUXGACarte graphique AMD Radeon™ 8050S',
            'price'=>  3425.83 ,
            'image'=>'storage/products/ultra.jpg'
        ]);







    }
}



