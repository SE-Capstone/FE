// import { notify } from '@/libs/helpers';

// export function useRemoveUserHook() {
//   const [removeUser, removeUserResult] = useRemoveUserMutation();

//   function handleRemoveUser(userId: string, onSuccessRemoveUser?: () => void) {
//     if (removeUserResult.loading) return;
//     removeUser({
//       variables: { id: userId },
//       refetchQueries: [GetListUsersDocument],
//       onCompleted() {
//         onSuccessRemoveUser?.();
//         notify({
//           type: 'success',
//           message: 'Xóa thành công',
//         });
//       },
//       onError() {
//         notify({
//           type: 'error',
//           message: 'Xóa không thành công',
//         });
//       },
//     });
//   }

//   return {
//     removeUserResult,
//     handleRemoveUser,
//   };
// }
