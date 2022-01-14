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

//##########################
//SCHOOL
$shema_users=[
'user_id'=>'"user_id" integer NOT NULL PRIMARY KEY AUTOINCREMENT',
'user_pseudo'=>'"user_pseudo" text NULL',
'user_password'=>'"user_password" text NULL',
'user_type'=>'"user_type" text NOT NULL DEFAULT \'user\'',
'user_matiere'=>'"user_matiere" integer NOT NULL DEFAULT -1',
'user_mail'=>'"user_mail" text NULL',
'user_token'=>'"user_token" text NULL',
'user_config'=>'"user_config" text NULL',
'user_nom'=>'"user_nom" text NOT NULL DEFAULT \'\'',
'user_prenom'=>'"user_prenom" text NOT NULL DEFAULT \'\'',
'user_mailVerified'=>'"user_mailVerified" integer NULL',
'user_role'=>'"user_role" text NOT NULL DEFAULT \'\'',
'user_civilite'=>'"user_civilite" text NOT NULL DEFAULT \'\'',
'user_sessionID'=>'"user_sessionID" text NULL',
'user_level'=>'"user_level" integer NOT NULL DEFAULT \'0\''
];

$shema_options=[
'option_name'=>'"option_name" text NULL',
'option_value'=>'"option_value" text NULL'
];

$shema_periodes=[
"periode_id"=>'"periode_id" integer NOT NULL PRIMARY KEY AUTOINCREMENT',
"periode_type"=>'"periode_type" text NULL',
"periode_parent"=>'"periode_parent" integer NULL',
"periode_titre"=>'"periode_titre" text NULL',
"periode_active"=>'"periode_active" integer NULL',
"periode_start"=>'"periode_start" integer NULL',
"periode_end"=>'"periode_end" integer NULL',
"periode_lock"=>'"periode_lock" integer NULL',
"periode_lock_date"=>'"periode_lock_date" integer NULL'
];

$shema_legends=[
'legend_id'=>'"legend_id" integer NOT NULL PRIMARY KEY AUTOINCREMENT',
'legend_text'=>'"legend_text" text NULL',
'legend_event'=>'"legend_event" text NULL'
];

$shema_disciplines=[
'discipline_id'=>'"discipline_id" integer NOT NULL PRIMARY KEY AUTOINCREMENT',
'discipline_name'=>'"discipline_name" text NULL'
];
//##########################
//##########################
//STUDENTS
$shema_eleves=[
'eleve_id'=>'"eleve_id" integer NOT NULL PRIMARY KEY AUTOINCREMENT',
'eleve_nom'=>'"eleve_nom" text NULL',
'eleve_prenom'=>'"eleve_prenom" text NULL',
'eleve_classe'=>'"eleve_classe" integer NOT NULL DEFAULT 1',//0 si l'élève n'appartient à aucun classe, sinon 1.
'eleve_token'=>'"eleve_token" text NULL',
'eleve_statut'=>'"eleve_statut" text NULL',
'eleve_genre'=>'"eleve_genre" text NULL',
'eleve_birthday'=>'"eleve_birthday" text NULL',
'eleve_cycle'=>'"eleve_cycle" text NULL',
'eleve_picture'=>'"eleve_picture" text NULL'
];
//##########################
//##########################
//CLASSROOMS
$shema_classes=[
'classe_id'=>'"classe_id" integer NOT NULL PRIMARY KEY AUTOINCREMENT',
'classe_nom'=>'"classe_nom" text NULL',
'classe_destinataires'=>'"classe_destinataires" text NULL',
'classe_pp'=>'"classe_pp" integer NULL',
'classe_millesime'=>'"classe_millesime" integer NOT NULL DEFAULT \'-1\''
];

$shema_relations_eleves_classes=[
'rec_id'=>'"rec_id" integer NOT NULL PRIMARY KEY AUTOINCREMENT',
'rec_eleve'=>'"rec_eleve" integer NULL',
'rec_classe'=>'"rec_classe" integer NULL'
];

$shema_groupes=[
'groupe_id'=>'"groupe_id" integer NOT NULL PRIMARY KEY AUTOINCREMENT',
'groupe_user'=>'"groupe_user" integer NULL',
'groupe_classe'=>'"groupe_classe" integer NULL',
'groupe_data'=>'"groupe_data" text NULL',
'groupe_name'=>'"groupe_name" text NULL'
];

$shema_plans=[
'plan_id'=>'"plan_id" integer NOT NULL PRIMARY KEY AUTOINCREMENT',
'plan_user'=>'"plan_user" integer NULL',
'plan_classe'=>'"plan_classe" integer NULL',
'plan_data'=>'"plan_data" text NULL'
];

$shema_controles=[
"controle_id"=>'"controle_id" integer NOT NULL PRIMARY KEY AUTOINCREMENT',
"controle_user"=>'"controle_user" integer NULL',
"controle_discipline"=>'"controle_discipline" integer NULL',
"controle_titre"=>'"controle_titre" text NULL',
"controle_date"=>'"controle_date" integer NULL',
"controle_note"=>'"controle_note" integer NULL',
"controle_classe"=>'"controle_classe" integer NULL',
"controle_coefficient"=>'"controle_coefficient" integer NULL',
"controle_categorie"=>'"controle_categorie" text NULL',
"controle_periode"=>'"controle_periode" integer NOT NULL DEFAULT \'-1\'',
"controle_bonus"=>'"controle_bonus" integer NOT NULL DEFAULT \'0\'',
"controle_type"=>'"controle_type" text NOT NULL DEFAULT \'S\''
];

$shema_notes=[
"note_id"=>'"note_id" integer NOT NULL PRIMARY KEY AUTOINCREMENT',
"note_eleve"=>'"note_eleve" integer NULL',
"note_controle"=>'"note_controle" integer NULL',
"note_value"=>'"note_value" integer NULL',
"note_date"=>'"note_date" integer NULL',
"note_bonus"=>'"note_bonus" integer NOT NULL DEFAULT \'0\''
];
//##########################
//##########################
//CHALLENGES
$shema_defis=[
"defi_id"=>'"defi_id" integer NOT NULL PRIMARY KEY AUTOINCREMENT',
"defi_user"=>'"defi_user" text NULL',
"defi_titre"=>'"defi_titre" text NULL',
"defi_description"=>'"defi_description" text NULL',
"defi_tags"=>'"defi_tags" text NULL',
"defi_date"=>'"defi_date" integer NULL',
"defi_etoiles"=>'"defi_etoiles" integer NULL',
"defi_icon"=>'"defi_icon" text NULL',
"defi_url"=>'"defi_url" text NULL',
"defi_flux"=>'"defi_flux" text NULL',
"defi_token"=>'"defi_token" text NULL'
];

$shema_etoiles=[
"etoile_id"=>'"etoile_id" integer NOT NULL PRIMARY KEY AUTOINCREMENT',
"etoile_eleve"=>'"etoile_eleve" integer NULL',
"etoile_defi"=>'"etoile_defi" integer NULL',
"etoile_value"=>'"etoile_value" integer NULL',
"etoile_date"=>'"etoile_date" integer NULL',
"etoile_state"=>'"etoile_state" integer NOT NULL DEFAULT \'0\'',
"etoile_type"=>'"etoile_type" text NOT NULL DEFAULT \'defi\''
];
//##########################
//##########################
//MESSAGES
$shema_messages=[
'message_id'=>'"message_id" integer NOT NULL PRIMARY KEY AUTOINCREMENT',
'message_author'=>'"message_author" text NULL',
'message_author_type'=>'"message_author_type" text NULL',
'message_subject'=>'"message_subject" text NULL',
'message_content'=>'"message_content" text NULL',
'message_date'=>'"message_date" text NULL',
'message_parent_message'=>'"message_parent_message" integer NULL',
'message_parent_reponse'=>'"message_parent_reponse" integer NULL'
];

$shema_relations_messagerie=[
'rm_id'=>'"rm_id" integer NOT NULL PRIMARY KEY AUTOINCREMENT',
'rm_messages'=>'"rm_messages" integer NULL',
'rm_type'=>'"rm_type" text NULL',
'rm_type_id'=>'"rm_type_id" integer NULL',
'rm_lock'=>'"rm_lock" integer NOT NULL DEFAULT 0',
'rm_read'=>'"rm_read" text NULL'
];
//##########################
//##########################
//SHARES
$shema_files=[
'file_id'=>'"file_id" integer NOT NULL PRIMARY KEY AUTOINCREMENT',
'file_name'=>'"file_name" text NULL',
'file_type'=>'"file_type" text NULL',
'file_size'=>'"file_size" text NULL',
'file_fullname'=>'"file_fullname" text NULL',
'file_user'=>'"file_user" text NULL',
'file_date'=>'"file_date" integer NULL',
'file_visibility'=>'"file_visibility" integer NOT NULL DEFAULT \'1\''
];

$shema_links=[
'link_id'=>'"link_id" integer NOT NULL PRIMARY KEY AUTOINCREMENT',
'link_titre'=>'"link_titre" text NULL',
'link_url'=>'"link_url" text NULL',
'link_favicon'=>'"link_favicon" text NULL',
'link_user'=>'"link_user" text NULL',
'link_date'=>'"link_date" integer NULL'
];

$shema_shares=[
'share_id'=>'"share_id" integer NOT NULL PRIMARY KEY AUTOINCREMENT',
'share_type'=>'"share_type" text NULL',
'share_item_id'=>'"share_item_id" text NULL',
'share_item_type'=>'"share_item_type" text NULL',
'share_with'=>'"share_with" text NULL',
'share_date'=>'"share_date" integer NULL',
'share_user'=>'"share_user" integer NULL'
];
//##########################
//##########################
//SKILLS
$shema_items=[
'item_id'=>'"item_id" integer NOT NULL PRIMARY KEY AUTOINCREMENT',
'item_name'=>'"item_name" text NULL',
'item_categorie'=>'"item_categorie" text NULL',
'item_value_max'=>'"item_value_max" text NULL',
'item_date'=>'"item_date" integer NULL',
'item_user'=>'"item_user" integer NULL',
'item_public'=>'"item_public" integer NULL',
'item_mode'=>'"item_mode" text NULL',
'item_colors'=>'"item_colors" text NULL',
'item_descriptions'=>'"item_descriptions" text NULL',
'item_tags'=>'"item_tags" text NULL',
'item_color'=>'"item_color" text NULL',
'item_vue'=>'"item_vue" text NOT NULL DEFAULT \'cursor\'',
'item_sous_categorie'=>'"item_sous_categorie" text NULL',
'item_cycle'=>'"item_cycle" integer  NOT NULL DEFAULT \'-1\'',
'item_feedbacks'=>'"item_feedbacks" text NULL'
];
$shema_relations_eleves_items=[
'rei_id'=>'"rei_id" integer NOT NULL PRIMARY KEY AUTOINCREMENT',
'rei_eleve'=>'"rei_eleve" integer NULL',
'rei_item'=>'"rei_item" integer NULL',
'rei_value'=>'"rei_value" integer NULL',
'rei_date'=>'"rei_date" integer NULL',
'rei_user'=>'"rei_user" integer NULL',
'rei_user_type'=>'"rei_user_type" text NOT NULL DEFAULT \'user\'',
'rei_activite'=>'"rei_activite" text NULL',
'rei_comment'=>'"rei_comment" text NULL',
'rei_coefficient'=>'"rei_coefficient" text NULL',
'rei_type'=>'"rei_type" text NULL',
'rei_periode'=>'"rei_periode" integer NULL'
];

$shema_filters=[
'filter_id'=>'"filter_id" integer NOT NULL PRIMARY KEY AUTOINCREMENT',
'filter_user'=>'"filter_user" integer NULL',
'filter_data'=>'"filter_data" text NULL'
];
$shema_feedbacks=[
'feedback_id'=>'"feedback_id" integer NOT NULL PRIMARY KEY AUTOINCREMENT',
'feedback_user'=>'"feedback_user" integer NULL',
'feedback_code'=>'"feedback_code" text NULL',
'feedback_description'=>'"feedback_description" text NULL',
'feedback_data'=>'"feedback_data" text NULL',
'feedback_date'=>'"feedback_date" integer NULL'
];
$shema_activities=[
'activity_id'=>'"activity_id" integer NOT NULL PRIMARY KEY AUTOINCREMENT',
'activity_user'=>'"activity_user" integer NULL',
'activity_name'=>'"activity_name" text NULL',
'activity_requirements'=>'"activity_requirements" text NULL',
'activity_date'=>'"activity_date" integer NULL',
'activity_data'=>'"activity_data" text NULL',
'activity_description'=>'"activity_description" text NULL'

];

//##########################
//##########################
//ORGANIZER
$shema_agenda=[
'event_id'=>'"event_id" integer NOT NULL PRIMARY KEY AUTOINCREMENT',
'event_title'=>'"event_title" text NULL',
'event_data'=>'"event_data" text NULL',
'event_color'=>'"event_color" text NULL',
'event_icon'=>'"event_icon" text NULL',
'event_type'=>'"event_type" text NULL',
'event_type_id'=>'"event_type_id" integer NULL',
'event_start'=>'"event_start" integer NULL',
'event_end'=>'"event_end" integer NULL',
'event_allDay'=>'"event_allDay" integer NULL',
'event_user'=>'"event_user" integer NULL',
'event_visibility'=>'"event_visibility" text NOT NULL DEFAULT \'false\'',
'event_state'=>'"event_state" integer NULL',
'event_date'=>'"event_date" integer NULL',
'event_lock'=>'"event_lock" integer NULL',
'event_periode'=>'"event_periode" integer NULL',
'event_discipline'=>'"event_discipline" integer  NOT NULL DEFAULT \'-1\''
];
//##########################
//##########################
//BILANS
$shema_appreciations=[
'appreciation_id'=>'"appreciation_id" integer NOT NULL PRIMARY KEY AUTOINCREMENT',
'appreciation_user'=>'"appreciation_user" integer NULL',
'appreciation_type'=>'"appreciation_type" text NULL',
'appreciation_type_id'=>'"appreciation_type_id" integer NULL',
'appreciation_data'=>'"appreciation_data" text NULL',
'appreciation_periode'=>'"appreciation_periode" integer NULL'
];

$shema_memos=[
'memo_id'=>'"memo_id" integer NOT NULL PRIMARY KEY AUTOINCREMENT',
'memo_user'=>'"memo_user" integer NULL',
'memo_type'=>'"memo_type" text NULL',
'memo_type_id'=>'"memo_type_id" integer NULL',
'memo_data'=>'"memo_data" text NULL'
];
//##########################
//##########################
//SOCIOGRAMMES
$shema_sociogrammesForms=[
'sociogramme_id'=>'"sociogramme_id" integer NOT NULL PRIMARY KEY AUTOINCREMENT',
'sociogramme_name'=>'"sociogramme_name" text NULL',
'sociogramme_questions'=>'"sociogramme_questions" text NULL',
'sociogramme_date'=>'"sociogramme_date" integer NULL',
'sociogramme_user'=>'"sociogramme_user" integer NULL'
];
$shema_socioRelations=[
'socioRelation_id'=>'"socioRelation_id" integer NOT NULL PRIMARY KEY AUTOINCREMENT',
'socioRelation_user'=>'"socioRelation_user" integer NULL',
'socioRelation_user_type'=>'"socioRelation_user_type" integer NULL',
'socioRelation_sociogramme'=>'"socioRelation_sociogramme" integer NULL',
'socioRelation_question'=>'"socioRelation_question" integer NULL',
'socioRelation_from'=>'"socioRelation_from" integer NULL',
'socioRelation_to'=>'"socioRelation_to" integer NULL',
'socioRelation_date'=>'"socioRelation_date" integer NULL'
];
$shema_sociogrammesSaves=[
'sociogrammeSave_id'=>'"sociogrammeSave_id" integer NOT NULL PRIMARY KEY AUTOINCREMENT',
'sociogrammeSave_data'=>'"sociogrammeSave_data" text NULL',
'sociogrammeSave_classe'=>'"sociogrammeSave_classe" integer NULL',
'sociogrammeSave_sociogramme'=>'"sociogrammeSave_sociogramme" integer NULL',
'sociogrammeSave_user'=>'"sociogrammeSave_user" integer NULL',
'sociogrammeSave_picture'=>'"sociogrammeSave_picture" text NULL',
'sociogrammeSave_date'=>'"sociogrammeSave_date" integer NULL'
];
//##########################
//##########################
//TOKENS
$shema_tokens=[
'token_id'=>'"token_id" integer NOT NULL PRIMARY KEY AUTOINCREMENT',
'token_uuid'=>'"token_uuid" text NULL',
'token_user'=>'"token_user" integer NULL',
'token_expire'=>'"token_expire" integer NULL'
];