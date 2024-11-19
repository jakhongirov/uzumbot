CREATE TABLE admins (
   admin_id bigserial PRiMARY KEY,
   admin_email text not null,
   admin_password text not null,
   admin_role text DEFAULT 'admin',
   admin_create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
   id bigserial,
   chat_id bigint PRIMARY KEY,
   name text,
   phone_number text,
   step text DEFAULT 'start',
   lesson int DEFAULT 0,
   source text,
   lesson_date text,
   pay_status boolean DEFAULT false,
   pay_type text,
   create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE actions (
   id bigserial PRIMARY KEY,
   user_id bigint,
   action int,
   create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE click (
   id bigserial PRiMARY KEY,
   click_id text,
   amount bigint,
   user_id int,
   merchant_id text,
   error text,
   error_note text,
   status text,
   transaction_create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payme (
   id bigserial PRiMARY KEY,
   user_id int,
   state int DEFAULT 0,
   amount bigint,
   create_time bigint DEFAULT 0,
   perform_time bigint DEFAULT 0,
   cancel_time bigint DEFAULT 0,
   transaction text,
   reason int,
   transaction_create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);