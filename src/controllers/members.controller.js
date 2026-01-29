const pool = require("../config/db");

// ➕ CREATE MEMBER
exports.createMember = async (req, res) => {
  const {
    emri,
    mbiemri,
    kategoria_pageses,
    viti_pageses,
    pagesa_rymes,
    fondi_varrezave,
    fondi_xhamine
  } = req.body;

  try {
    const result = await pool.query(
      `
      INSERT INTO members
      (
        emri,
        mbiemri,
        kategoria_pageses,
        viti_pageses,
        pagesa_rymes,
        fondi_varrezave,
        fondi_xhamine,
        user_id
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *
      `,
      [
        emri,
        mbiemri,
        kategoria_pageses,
        viti_pageses,
        pagesa_rymes,
        fondi_varrezave,
        fondi_xhamine,
        req.user.id
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Error creating member" });
  }
};

// 📄 GET ALL MEMBERS (vetëm të user-it)
exports.getMembers = async (req, res) => {
  const { page = 1, search = "" } = req.query;
  const limit = 15;
  const offset = (page - 1) * limit;

  try {
    const result = await pool.query(
      `
      SELECT * FROM members
      WHERE user_id = $1
      AND (
        emri ILIKE $2 OR
        mbiemri ILIKE $2 OR
        kategoria_pageses ILIKE $2
      )
      ORDER BY id ASC
      LIMIT $3 OFFSET $4
      `,
      [req.user.id, `%${search}%`, limit, offset]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Error fetching members" });
  }
};

// 📄 GET ONE MEMBER
exports.getMemberById = async (req, res) => {
  const { id } = req.params;

  const result = await pool.query(
    "SELECT * FROM members WHERE id = $1 AND user_id = $2",
    [id, req.user.id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ message: "Member not found" });
  }

  res.json(result.rows[0]);
};

// ✏️ UPDATE
exports.updateMember = async (req, res) => {
  const { id } = req.params;
  const {
    emri,
    mbiemri,
    kategoria_pageses,
    viti_pageses,
    pagesa_rymes,
    fondi_varrezave,
    fondi_xhamine
  } = req.body;

  const result = await pool.query(
    `
    UPDATE members SET
      emri=$1,
      mbiemri=$2,
      kategoria_pageses=$3,
      viti_pageses=$4,
      pagesa_rymes=$5,
      fondi_varrezave=$6,
      fondi_xhamine=$7
    WHERE id=$8 AND user_id=$9
    RETURNING *
    `,
    [
      emri,
      mbiemri,
      kategoria_pageses,
      viti_pageses,
      pagesa_rymes,
      fondi_varrezave,
      fondi_xhamine,
      id,
      req.user.id
    ]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ message: "Member not found" });
  }

  res.json(result.rows[0]);
};

// ❌ DELETE
exports.deleteMember = async (req, res) => {
  const { id } = req.params;

  const result = await pool.query(
    "DELETE FROM members WHERE id=$1 AND user_id=$2 RETURNING *",
    [id, req.user.id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ message: "Member not found" });
  }

  res.json({ message: "Member deleted" });
};
