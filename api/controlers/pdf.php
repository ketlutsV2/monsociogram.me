<?php
// Copyright 2022 Pierre GIRARDOT

// This file is part of Sociogram.me.

// Sociogram.me is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version GPL-3.0-or-later of the License.

// Sociogram.me is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Sociogram.me.  If not, see <https://www.gnu.org/licenses/>.

class Pdf {
     /**
     *
     * @var Instance
     */
     private static $_instance;
    /**
     * Empêche la création externe d'instances.
     */
    private function __construct() {}
    /**
     * Empêche la copie externe de l'instance.
     */
    private function __clone() {}
    /**
     * 
     * @return PDF
     */
    public static function getInstance() {
      if (!(self::$_instance instanceof self))
        self::$_instance = new self();
      return self::$_instance;
    }
    public function a4(){
     global $_, $user;
     MainControl::init('users','get');
     $html_data=$_POST['export-pdf-data'];


     if(!isset($_['export-pdf-orientation'])){
      $_['export-pdf-orientation']="L";
    }
    header('Content-Type: application/pdf');
    header('Content-Disposition: attachment; filename="Sociogram_'.$_['export-pdf-titre'].'.pdf"');

    $html2pdf = new \Spipu\Html2Pdf\Html2Pdf($_['export-pdf-orientation'], 'A4', 'fr');
    $html2pdf->writeHTML($html_data);
    $html2pdf->output("Sociogram_".$_['export-pdf-titre'].".pdf", 'D'); 
    exit;

  }
}
?>