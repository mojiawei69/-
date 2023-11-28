import { AxiosApi } from "@/Request/AxiosApis";
import { ElMessage } from "element-plus";
import { Ref, ref } from "vue";
import { DeleteProps, EditProps, ITableFunction, ListMetaData, Pagination, PaginationQuery, Sorted } from "./index.type";
import { DataModules } from "@/Request/DataModules/DataModules";

export function useTableFunction<T extends AxiosApi, Query extends object, Edit extends object>(
  apiname: string,
  TableApi: new () => T,
  UserSearchQuery: Query,                // 用户查询参数
  UserEditParam: Ref<Edit>,                   // 用户添加&编辑表单
  PaginationQuery?: Sorted & Pagination  // 分页请求参数 & 用户自定义请求参数
) : ITableFunction {
  //分页参数
  const limit = ref(PaginationQuery?.limit ?? 10);
  const offset = ref(PaginationQuery?.offset ?? 1);
  const props = ref(PaginationQuery?.prop);
  const order = ref(PaginationQuery?.order);
  //分页参数

  const useTableApi = new TableApi();

  const DataSource = ref<object[]>([]);
  const total = ref(0);

  const isEdit = ref(false);
  const EditTxt = ref<'修改' | '添加'>('修改');
  const TableLoading = ref(false);
  const EditLoading = ref(false);
  
  //合并查询参数
  const queryBuilder = () => {
    const query = Object.assign(UserSearchQuery, 
      { 
        limit: limit.value, 
        offset: offset.value, 
        props: props.value, 
        order: order.value 
      });
    return query;
  }

  //表格加载数据
  const loadTableDatas = () => {
    TableLoading.value = true;
    useTableApi.get<PaginationQuery<Query>, ListMetaData<DataModules[]>>(`/list?date=${new Date().getTime()}`, queryBuilder()).then( res => {
      setTimeout(() => {
        DataSource.value = res.data.data.list;
        total.value = res.data.data.meta.total;
        TableLoading.value = false;
      }, 500);
    }).catch(error => { ElMessage.error(error); });
  }

  //删除按钮
  const handleDelete = (deleteNode : DataModules) => {
    useTableApi.delete<DeleteProps>("/delete", { id: deleteNode.id }).then( res => {
      setTimeout( async () => {
        ElMessage.success("删除成功");
        loadTableDatas();
      }, 500);
    })
  }

  const handleSizeChange = (val: number) => {
    limit.value = val;
    loadTableDatas();
  }

  const handleCurrentChange = (val: number) => {
    offset.value = val;
    loadTableDatas();
  }

  const handleSortChange = (val: Sorted) => {
    console.log(val);
  }

  const handleEditClose = () => {
    isEdit.value = false;
  }

  const handleEditConfirm = () => {
    console.log(UserEditParam.value);
  }

  const handleEditOpen = (type: EditProps, row?: DataModules) => {
    isEdit.value = true;
    console.log(type, row);
  }

  return { 
    apiname,
    DataSource, 
    loadTableDatas, 
    TableLoading, 
    total, 
    isEdit, 
    handleEditClose, 
    handleEditConfirm, 
    handleEditOpen, 
    EditTxt, 
    handleCurrentChange,
    handleSizeChange,
    handleSortChange,
    EditLoading,
    handleDelete
  }
}