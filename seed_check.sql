SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict va4RvdM1uSk4GPEvGPW2oaICECTvfhcDfaKmbEVJkhtkUE8LS8it30OuKzghPWP

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: custom_oauth_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', 'c19419cf-236c-436f-ae22-7dca2b9a5e00', 'authenticated', 'authenticated', 'rachmadideni@gmail.com', '$2a$10$NtVX12W4vesFBj8Ly7IXOONWN/75DxvGf1hF13Md6y98LdL/PqmM6', '2026-06-26 19:08:44.894608+00', NULL, '', '2026-06-26 19:08:20.973425+00', '', NULL, '', '', NULL, '2026-06-26 19:15:27.460464+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "c19419cf-236c-436f-ae22-7dca2b9a5e00", "email": "rachmadideni@gmail.com", "email_verified": true, "phone_verified": false}', NULL, '2026-06-26 19:08:20.925326+00', '2026-06-27 01:06:29.430829+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('c19419cf-236c-436f-ae22-7dca2b9a5e00', 'c19419cf-236c-436f-ae22-7dca2b9a5e00', '{"sub": "c19419cf-236c-436f-ae22-7dca2b9a5e00", "email": "rachmadideni@gmail.com", "email_verified": true, "phone_verified": false}', 'email', '2026-06-26 19:08:20.961096+00', '2026-06-26 19:08:20.961149+00', '2026-06-26 19:08:20.961149+00', 'f78e07e2-283a-4371-895e-fb062b978982');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag", "oauth_client_id", "refresh_token_hmac_key", "refresh_token_counter", "scopes") VALUES
	('e1576f0d-0e5c-4934-892f-d8c415c6e9e7', 'c19419cf-236c-436f-ae22-7dca2b9a5e00', '2026-06-26 19:08:50.004755+00', '2026-06-26 19:08:50.004755+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '125.166.18.123', NULL, NULL, NULL, NULL, NULL),
	('439c9850-2439-4312-b01a-dcb8cf36aabb', 'c19419cf-236c-436f-ae22-7dca2b9a5e00', '2026-06-26 19:08:58.24024+00', '2026-06-26 19:08:58.24024+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '125.166.18.123', NULL, NULL, NULL, NULL, NULL),
	('0bb9324f-e947-4cf8-9ee7-6a6d0042b8f7', 'c19419cf-236c-436f-ae22-7dca2b9a5e00', '2026-06-26 19:09:21.093229+00', '2026-06-26 19:09:21.093229+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '125.166.18.123', NULL, NULL, NULL, NULL, NULL),
	('86925908-a313-433b-9e2c-2f913ace71b6', 'c19419cf-236c-436f-ae22-7dca2b9a5e00', '2026-06-26 19:09:43.186266+00', '2026-06-26 19:09:43.186266+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '125.166.18.123', NULL, NULL, NULL, NULL, NULL),
	('308213e1-bcfe-4fe8-a28f-8f41ee3eaaeb', 'c19419cf-236c-436f-ae22-7dca2b9a5e00', '2026-06-26 19:13:18.528813+00', '2026-06-26 19:13:18.528813+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '125.166.18.123', NULL, NULL, NULL, NULL, NULL),
	('49563f34-d5bf-4515-9dc2-9faa5e7b727d', 'c19419cf-236c-436f-ae22-7dca2b9a5e00', '2026-06-26 19:15:27.46061+00', '2026-06-27 01:06:29.445347+00', NULL, 'aal1', NULL, '2026-06-27 01:06:29.445234', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '125.166.18.123', NULL, NULL, NULL, NULL, NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('e1576f0d-0e5c-4934-892f-d8c415c6e9e7', '2026-06-26 19:08:50.017777+00', '2026-06-26 19:08:50.017777+00', 'email/signup', '6e0a5af7-b55b-4629-b1ce-3df0ed177431'),
	('439c9850-2439-4312-b01a-dcb8cf36aabb', '2026-06-26 19:08:58.242921+00', '2026-06-26 19:08:58.242921+00', 'password', 'd635b7b9-7c5a-4d6b-b29c-a539400bbca3'),
	('0bb9324f-e947-4cf8-9ee7-6a6d0042b8f7', '2026-06-26 19:09:21.123821+00', '2026-06-26 19:09:21.123821+00', 'password', 'f4228f8a-0f23-4d60-9047-afe4815023d9'),
	('86925908-a313-433b-9e2c-2f913ace71b6', '2026-06-26 19:09:43.189808+00', '2026-06-26 19:09:43.189808+00', 'password', '35ad429c-6475-42dc-bc92-76489a9e8370'),
	('308213e1-bcfe-4fe8-a28f-8f41ee3eaaeb', '2026-06-26 19:13:18.545449+00', '2026-06-26 19:13:18.545449+00', 'password', '8c51922e-b2c5-4421-906d-a98139d70b8f'),
	('49563f34-d5bf-4515-9dc2-9faa5e7b727d', '2026-06-26 19:15:27.477441+00', '2026-06-26 19:15:27.477441+00', 'password', 'b5684f19-0be1-40e8-bac3-575853d6cad3');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 1, 'qzdgtrfcaylw', 'c19419cf-236c-436f-ae22-7dca2b9a5e00', false, '2026-06-26 19:08:50.009983+00', '2026-06-26 19:08:50.009983+00', NULL, 'e1576f0d-0e5c-4934-892f-d8c415c6e9e7'),
	('00000000-0000-0000-0000-000000000000', 2, 'k45hfsq75q3b', 'c19419cf-236c-436f-ae22-7dca2b9a5e00', false, '2026-06-26 19:08:58.241559+00', '2026-06-26 19:08:58.241559+00', NULL, '439c9850-2439-4312-b01a-dcb8cf36aabb'),
	('00000000-0000-0000-0000-000000000000', 3, 's6fx7c6cg5ya', 'c19419cf-236c-436f-ae22-7dca2b9a5e00', false, '2026-06-26 19:09:21.121365+00', '2026-06-26 19:09:21.121365+00', NULL, '0bb9324f-e947-4cf8-9ee7-6a6d0042b8f7'),
	('00000000-0000-0000-0000-000000000000', 4, 'dcu4ofvuzzev', 'c19419cf-236c-436f-ae22-7dca2b9a5e00', false, '2026-06-26 19:09:43.188433+00', '2026-06-26 19:09:43.188433+00', NULL, '86925908-a313-433b-9e2c-2f913ace71b6'),
	('00000000-0000-0000-0000-000000000000', 5, 'pjie7g2vbngx', 'c19419cf-236c-436f-ae22-7dca2b9a5e00', false, '2026-06-26 19:13:18.540777+00', '2026-06-26 19:13:18.540777+00', NULL, '308213e1-bcfe-4fe8-a28f-8f41ee3eaaeb'),
	('00000000-0000-0000-0000-000000000000', 6, 'woythcy3tdy6', 'c19419cf-236c-436f-ae22-7dca2b9a5e00', true, '2026-06-26 19:15:27.473347+00', '2026-06-27 01:06:29.401879+00', NULL, '49563f34-d5bf-4515-9dc2-9faa5e7b727d'),
	('00000000-0000-0000-0000-000000000000', 7, 'msjuqheil6iw', 'c19419cf-236c-436f-ae22-7dca2b9a5e00', false, '2026-06-27 01:06:29.421265+00', '2026-06-27 01:06:29.421265+00', 'woythcy3tdy6', '49563f34-d5bf-4515-9dc2-9faa5e7b727d');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: webauthn_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: webauthn_credentials; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: tenants; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."tenants" ("id", "name", "slug", "settings", "usage_limit_monthly", "is_active", "created_at", "updated_at") VALUES
	('a3847728-4e19-44d8-a33f-7087d90e684f', 'golden wish', 'golden-wish', '{}', 500, true, '2026-06-26 19:16:51.0253+00', '2026-06-26 19:16:51.0253+00');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."users" ("id", "email", "role", "tenant_id", "is_active", "created_at") VALUES
	('c19419cf-236c-436f-ae22-7dca2b9a5e00', 'rachmadideni@gmail.com', 'super_admin', NULL, true, '2026-06-26 19:08:20.923971+00');


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: business_access_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."business_access_tokens" ("id", "tenant_id", "token", "pin_code", "label", "is_active", "expires_at", "created_at", "updated_at") VALUES
	('5fbda22a-495d-40a5-9e4c-b1b519d9a08a', 'a3847728-4e19-44d8-a33f-7087d90e684f', 'faf0b76b-538d-4d6c-a551-e04e72eaa21c', NULL, 'Default staff access', true, NULL, '2026-06-26 19:16:51.101446+00', '2026-06-26 19:16:51.101446+00');


--
-- Data for Name: conversations; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: documents; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: document_chunks; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: usage_tracking; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 7, true);


--
-- PostgreSQL database dump complete
--

-- \unrestrict va4RvdM1uSk4GPEvGPW2oaICECTvfhcDfaKmbEVJkhtkUE8LS8it30OuKzghPWP

RESET ALL;
