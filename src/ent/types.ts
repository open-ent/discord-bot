/**
 * Réponse de GET /auth/oauth2/userinfo. Le format exact dépend de l'adaptateur
 * entcore configuré côté plateforme (ResponseAdapterFactory.getUserInfoAdapter) ;
 * ces champs couvrent la session utilisateur "brute" (org.entcore.common.user.UserInfos)
 * et sont lus de façon défensive par `extractProfile` (voir entApi.ts).
 */
export interface EntUserInfo {
  userId?: string;
  sub?: string;
  username?: string;
  firstName?: string;
  given_name?: string;
  lastName?: string;
  family_name?: string;
  type?: string;
  classNames?: string[];
  structureNames?: string[];
  structures?: string[];
  groupsNames?: string[];
  [key: string]: unknown;
}

export interface EntProfile {
  displayName: string;
  profile?: string;
  classNames: string[];
  structureNames: string[];
  structureIds: string[];
  groupNames: string[];
}

/** Colonnes de diary.homework (module cahier-de-textes), enrichies côté service. */
export interface EntHomework {
  id: string;
  subject_id?: string;
  description?: string;
  due_date?: string;
  color?: string;
  is_published?: boolean;
  type?: { id?: string; label?: string } | string;
  [key: string]: unknown;
}

/** Entrée de GET /workspace/documents. */
export interface EntDocument {
  _id?: string;
  name?: string;
  metadata?: { filename?: string };
  application?: string;
  modified?: unknown;
  [key: string]: unknown;
}

/** Cours renvoyé par le module edt (fr.cgi.edt). */
export interface EntCourse {
  _id?: string;
  subjectId?: string;
  startDate?: string;
  endDate?: string;
  roomLabels?: string[];
  classes?: string[];
  groups?: string[];
  [key: string]: unknown;
}

export interface EntRecipientGroup {
  id: string;
  groupDisplayName?: string;
  name?: string;
  [key: string]: unknown;
}
