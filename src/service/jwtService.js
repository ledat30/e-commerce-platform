import db from "../models";

async function getGroupWithRole(user) {
  let roles = await db.Group.findOne({
    where: { id: user.groupId },
    attributes: ["id", "name", "description"],
    include: [
      {
        model: db.Role,
        attributes: ["id", "roleName", "description"],
        //loại bỏ bảng thứ 3 là belongto
        through: { attributes: [] },
        //end
      },
    ],
  });
  return roles ? roles : {};
}

module.exports = {
  getGroupWithRole,
};
