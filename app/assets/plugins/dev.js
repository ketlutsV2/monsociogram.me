/*
Copyright 2022 Pierre GIRARDOT

This file is part of Sociogram.me.

Sociogram.me is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version GPL-3.0-or-later of the License.

Sociogram.me is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Sociogram.me.  If not, see <https://www.gnu.org/licenses/>.*/

var app=app || {};
app.plugins=app.plugins||[];
var devPlugin={
	name:'Auto-connexion',
	display:false,
	enabled:false,
	// params:{
	// 	etablissement:"test",
	// 	passe_etablissement:"test",
	// 	user:"nolhan",
	// 	passe_user:"nolhan"
	// },
	params:{
		etablissement:"0100005B",
		passe_etablissement:"passwordportier",
		user:"admin",
		passe_user:"p6kwcs"
	},
	connexionAfterRender:function(){
		document.getElementById("etablissement_nom").value=this.params.etablissement;
		document.getElementById("etablissement_passe").value=this.params.passe_etablissement;
		document.getElementById("user_pseudo").value=this.params.user;
		document.getElementById("user_passe").value=this.params.passe_user;
		app.connexion();
		this.enabled=false;
	}
};
app.plugins.push(devPlugin);