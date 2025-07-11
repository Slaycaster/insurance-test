import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("recommendations", (table) => {
    table.increments("id").primary();
    table.integer("age").notNullable();
    table.decimal("income", 12, 2).notNullable();
    table.integer("dependents").notNullable();
    table.enum("risk_tolerance", ["low", "medium", "high"]).notNullable();
    table.string("recommendation_type").notNullable();
    table.string("coverage_amount").notNullable();
    table.string("term_length").notNullable();
    table.text("explanation").notNullable();
    table.string("ip_address");
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("recommendations");
}
