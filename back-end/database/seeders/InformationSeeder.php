<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Information;

class InformationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $pages = [
            [
                'slug' => 'faq',
                'title' => 'Foire Aux Questions (FAQ)',
                'content' => '<h3>Comment puis-je suivre ma commande ?</h3><p>Vous pouvez suivre votre commande dans la section "Mes Commandes" de votre profil.</p><h3>Quels sont les délais de livraison ?</h3><p>Les délais varient entre 3 et 5 jours ouvrés selon votre localisation.</p>'
            ],
            [
                'slug' => 'shipping',
                'title' => 'Politique de Livraison',
                'content' => '<p>Nous livrons partout au Maroc. Les frais de livraison sont offerts pour toute commande supérieure à 500 MAD.</p>'
            ],
            [
                'slug' => 'returns',
                'title' => 'Retours et Remboursements',
                'content' => '<p>Vous avez 14 jours pour retourner un produit s\'il ne vous satisfait pas. Le produit doit être dans son emballage d\'origine.</p>'
            ],
            [
                'slug' => 'privacy',
                'title' => 'Politique de Confidentialité',
                'content' => '<p>Nous protégeons vos données personnelles avec le plus grand soin. Vos informations ne sont jamais partagées avec des tiers.</p>'
            ],
            [
                'slug' => 'terms',
                'title' => 'Conditions d\'Utilisation',
                'content' => '<p>En utilisant MonSite, vous acceptez de respecter nos conditions générales de vente et d\'utilisation.</p>'
            ],
            [
                'slug' => 'cookies',
                'title' => 'Politique des Cookies',
                'content' => '<p>Nous utilisons des cookies pour améliorer votre expérience. Vous pouvez les gérer via notre bannière de consentement.</p>'
            ]
        ];

        foreach ($pages as $page) {
            Information::updateOrCreate(['slug' => $page['slug']], $page);
        }
    }
}
