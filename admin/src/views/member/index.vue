<template>
    <div>
        <el-card>
            <div slot="header">
                <h3>人员管理</h3>
                <div class="c-flex-between header-act">
                    <el-input
                        class="search"
                        placeholder="请输入姓名"
                        prefix-icon="el-icon-search"
                        v-model="keyword"
                        @input="onSearch"
                    ></el-input>
                    <el-button
                        size="medium"
                        icon="el-icon-plus"
                        type="primary"
                        @click="onEdit(false)"
                    >新增</el-button>
                </div>
            </div>
            <el-table
                ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%"
            >
                <!-- <el-table-column sortable prop="date" label="日期" width="120">
                    <template slot-scope="scope">{{ scope.row.date }}</template>
                </el-table-column>-->
                <el-table-column type="index" :index="indexShow" label="序号"></el-table-column>
                <el-table-column sortable prop="username" label="姓名" align="center"></el-table-column>
                <el-table-column
                    sortable
                    prop="account"
                    label="账号"
                    align="center"
                    show-overflow-tooltip
                ></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                            size="small"
                            plain
                            type="primary"
                            @click="onEdit(scope.row.id)"
                        >编辑</el-button>
                        <el-button
                            size="small"
                            plain
                            type="danger"
                            @click="onDel(scope.row.id,scope.row.username)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="c-flex-center pagination">
                <el-pagination
                    background
                    layout="prev, pager, next"
                    :current-page="page"
                    :page-size="limit"
                    :total="count"
                    @current-change="pageChange"
                ></el-pagination>
            </div>
        </el-card>
        <el-dialog
            class="com-dialog"
            :title="dialogTit"
            :visible.sync="dialogVisible"
            width="600"
            center
            @close="onDialogClose"
        >
            <el-form label-position="left" ref="editUser" label-width="80px" :model="editUser">
                <el-form-item
                    label="姓名"
                    prop="username"
                    :rules="[ { required: true, message: '请输入姓名', trigger: 'blur' }]"
                >
                    <el-input v-model="editUser.username" maxlength="10" show-word-limit></el-input>
                </el-form-item>
                <el-form-item
                    label="账号"
                    prop="account"
                    :rules="[ { required: true, message: '请输入账号', trigger: 'blur' }]"
                >
                    <el-input v-model="editUser.account" maxlength="10" show-word-limit></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="onSubmit('editUser')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            dialogVisible: false,
            tableData: [],
            count: 0,
            page: 1,
            limit: 10,
            keyword: "",
            editUser: {
                id: "",
                username: "",
                account: "",
            },
            dialogTit: "新增人员",
            timer: null,
        };
    },
    mounted() {
        this.getList();
    },
    methods: {
        getList() {
            let query = {
                username: this.keyword,
                page: this.page,
                limit: this.limit,
            };
            this.$api.user.userList(query).then((res) => {
                if (res.code == 1) {
                    this.tableData = res.data.rows;
                    this.count = res.data.count;
                }
            });
        },
        onSearch() {
            if (this.timer) {
                return;
            }
            this.timer = setTimeout(() => {
                this.timer = null;
                this.page = 1;
                this.getList();
            }, 1000);
        },
        onSubmit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$api.user.editUser(this.editUser).then((res) => {
                        if (res.code == 1) {
                            this.dialogVisible = false;
                            this.$message({
                                type: "success",
                                message: "操作成功!",
                            });
                            this.getList();
                        }
                    });
                }
            });
        },
        pageChange(page) {
            this.page = page;
            this.getList();
        },
        indexShow(index) {
            return (this.page - 1) * this.limit + index + 1;
        },
        delItemUser(id) {
            this.$api.user.delUser(id).then((res) => {
                if (res.code == 1) {
                    this.getList();
                    this.$message({
                        type: "success",
                        message: "删除成功!",
                    });
                }
            });
        },
        onDialogClose() {
            this.editUser.id = "";
            this.editUser.username = "";
            this.editUser.account = "";
            this.$refs["editUser"].resetFields();
        },
        onEdit(id) {
            if (id) {
                this.dialogTit = "编辑人员";
                this.$api.user.userItem(id).then((res) => {
                    if (res.code == 1) {
                        this.editUser = res.data;
                        this.dialogVisible = true;
                    }
                });
            } else {
                this.dialogTit = "新增人员";
                this.dialogVisible = true;
            }
        },
        onDel(id, name) {
            this.$confirm("您确定要删除" + name + "吗?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                this.delItemUser(id);
            });
        },
    },
};
</script>

<style lang='scss' scoped>
.header-act {
    margin-top: 20px;
    .search {
        width: 30%;
    }
}
</style>
