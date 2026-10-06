import { vi as stockVi } from '@payloadcms/translations/languages/vi';

/**
 * Spelling: this admin writes "xoá" / "khoá" (oa + tone on the a), the stock
 * VI pack mixes in "xóa" / "khóa" ("Xác nhận xóa" next to "Xoá vĩnh viễn").
 * Every stock string is re-spelled once here and merged UNDER the hand-written
 * overrides below, so the whole admin reads the same.
 */
type Strings = { [key: string]: string | Strings };

const respell = (text: string) =>
  text.replace(/([xX])óa/g, '$1oá').replace(/([kK])hóa/g, '$1hoá').replace(/([xX])ỏa/g, '$1oả');

function respelled(tree: Strings): Strings {
  const out: Strings = {};
  for (const [key, value] of Object.entries(tree)) {
    if (typeof value === 'string') {
      const next = respell(value);
      if (next !== value) out[key] = next;
    } else if (value && typeof value === 'object') {
      const nested = respelled(value);
      if (Object.keys(nested).length) out[key] = nested;
    }
  }
  return out;
}

const deepMerge = (target: Strings, source: Strings): Strings => {
  for (const [key, value] of Object.entries(source)) {
    if (value && typeof value === 'object') {
      const base = target[key];
      target[key] = deepMerge(base && typeof base === 'object' ? base : {}, value);
    } else {
      target[key] = value;
    }
  }
  return target;
};

/**
 * Vietnamese overrides for Payload's built-in admin strings
 * (`i18n.translations.vi`, deep-merged over @payloadcms/translations/vi).
 *
 * The stock VI pack reads like a machine translation in places ("Xuất bản tài
 * liệu", "Ẩn tài liệu", "Field sau không hợp lệ") and talks about generic
 * "documents". These are the strings an editor sees every day, reworded for a
 * newsroom. Lexical toolbar labels are owned by the editor features
 * (src/cms/editor.ts) - richtext-lexical merges its own i18n after this.
 */
const handWritten = {
  authentication: {
    loggedOutInactivity: 'Bạn đã được tự động đăng xuất vì không thao tác trong một khoảng thời gian dài.',
    loggedOutSuccessfully: 'Bạn đã đăng xuất.',
    forgotPasswordEmailInstructions:
      'Nhập email tài khoản. Nếu hệ thống đã cấu hình gửi email, bạn sẽ nhận liên kết đặt lại mật khẩu (hết hạn sau 1 giờ). Nếu không nhận được, hãy liên hệ Quản trị viên.',
  },
  fields: {
    block: 'Khối',
    blocks: 'khối',
    blockType: 'Loại khối',
    chooseBetweenCustomTextOrDocument: 'Chọn dán đường dẫn (URL) hoặc liên kết tới một bài viết khác.',
    chooseDocumentToLink: 'Chọn bài viết để liên kết',
    relatedDocument: 'bài liên quan',
    searchForBlock: 'Tìm khối',
    toggleBlock: 'Thu gọn / mở rộng khối',
    uploadNewLabel: 'Tải {{label}} mới',
  },
  folder: {
    browseByFolder: 'Duyệt theo thư mục',
    byFolder: 'Theo thư mục',
    deleteFolder: 'Xoá thư mục',
    folderTypeDescription: 'Chọn loại nội dung được phép đặt trong thư mục này.',
    noFolder: 'Chưa vào thư mục',
    searchByNameInFolder: 'Tìm theo tên trong "{{folderName}}"',
  },
  upload: {
    addFile: 'Thêm tệp',
    addFiles: 'Thêm tệp',
    bulkUpload: 'Tải nhiều tệp',
    crop: 'Cắt ảnh',
    dragAndDrop: 'Kéo thả tệp vào đây',
    dragAndDropHere: 'hoặc kéo thả tệp vào đây',
    editImage: 'Sửa ảnh',
    fileName: 'Tên tệp',
    fileSize: 'Dung lượng',
    filesToUpload: 'Tệp sẽ tải lên',
    fileToUpload: 'Tệp sẽ tải lên',
    focalPoint: 'Điểm lấy nét',
    focalPointDescription: 'Kéo điểm lấy nét trên ảnh (hoặc nhập số bên dưới) để ảnh cắt đẹp ở mọi khung hình.',
    noFile: 'Chưa có tệp',
    pasteURL: 'Dán URL',
    selectCollectionToBrowse: 'Chọn thư viện để duyệt',
    selectFile: 'Chọn tệp',
    setFocalPoint: 'Đặt điểm lấy nét',
    sizes: 'Các cỡ ảnh',
  },
  general: {
    aboutToDelete: 'Bạn sắp xoá vĩnh viễn {{label}} <1>{{title}}</1>. Không thể hoàn tác. Tiếp tục?',
    aboutToTrash: 'Chuyển {{label}} <1>{{title}}</1> vào thùng rác? Có thể khôi phục lại sau.',
    copied: 'Đã sao chép',
    createNew: 'Tạo mới',
    createNewLabel: 'Thêm {{label}}',
    creating: 'Đang tạo…',
    deletePermanently: 'Xoá vĩnh viễn (bỏ qua thùng rác)',
    duplicate: 'Tạo bản sao',
    emptyTrash: 'Dọn thùng rác',
    exitLivePreview: 'Đóng xem trực tiếp',
    lastModified: 'Lần sửa cuối',
    livePreview: 'Xem trực tiếp',
    loading: 'Đang tải…',
    noLabel: '(Chưa có {{label}})',
    noResults: 'Không có {{label}} nào phù hợp. Đổi bộ lọc hoặc bấm "Tạo mới".',
    noResultsFound: 'Không tìm thấy kết quả phù hợp.',
    saving: 'Đang lưu…',
    searchBy: 'Tìm theo {{label}}',
    selectValue: 'Chọn…',
    successfullyDuplicated: 'Đã tạo bản sao {{label}}.',
    titleTrashed: 'Đã chuyển {{label}} "{{title}}" vào thùng rác.',
    trash: 'Thùng rác',
    untitled: 'Chưa có tiêu đề',
    updatedAt: 'Cập nhật lúc',
    createdAt: 'Tạo lúc',
    aboutToDeleteCount_many: 'Bạn sắp xoá {{count}} {{label}}',
    aboutToDeleteCount_one: 'Bạn sắp xoá {{count}} {{label}}',
    aboutToDeleteCount_other: 'Bạn sắp xoá {{count}} {{label}}',
    aboutToPermanentlyDelete: 'Bạn sắp xoá vĩnh viễn {{label}} <1>{{title}}</1>. Không thể hoàn tác. Tiếp tục?',
    aboutToRestore: 'Khôi phục {{label}} <1>{{title}}</1> từ thùng rác?',
    aboutToRestoreAsDraft: 'Khôi phục {{label}} <1>{{title}}</1> từ thùng rác dưới dạng bản nháp?',
    allCollections: 'Tất cả thư viện',
    collections: 'Mục quản lý',
    delete: 'Xoá',
    reloadDocument: 'Tải lại bài',
    successfullyCreated: 'Đã tạo {{label}}.',
    updatedSuccessfully: 'Đã lưu thay đổi.',
  },
  error: {
    accountAlreadyActivated: 'Tài khoản này đã được kích hoạt.',
    deletingFile: 'Không xoá được tệp. Vui lòng thử lại.',
    deletingTitle: 'Không xoá được {{title}}. Kiểm tra kết nối mạng rồi thử lại.',
    emailOrPasswordIncorrect: 'Email hoặc mật khẩu không đúng.',
    incorrectCollection: 'Mục quản lý không hợp lệ.',
    invalidFileType: 'Định dạng tệp không được hỗ trợ.',
    invalidFileTypeValue: 'Định dạng tệp không được hỗ trợ: {{value}}.',
    loadingDocument: 'Không tải được nội dung (ID {{id}}). Vui lòng tải lại trang.',
    missingEmail: 'Chưa nhập email.',
    missingRequiredData: 'Còn thiếu thông tin bắt buộc.',
    noFilesUploaded: 'Chưa có tệp nào được tải lên.',
    noMatchedField: 'Không tìm thấy trường "{{label}}".',
    notAllowedToAccessPage: 'Bạn không có quyền truy cập trang này.',
    notFound: 'Không tìm thấy nội dung.',
    previewing: 'Không mở được bản xem trước. Hãy lưu nháp rồi thử lại.',
    problemUploadingFile: 'Không tải lên được tệp. Vui lòng thử lại.',
    revertingDocument: 'Không hoàn tác được. Vui lòng thử lại.',
    tokenInvalidOrExpired: 'Liên kết không hợp lệ hoặc đã hết hạn.',
    // Also the title of /admin/logout: must not sound like an error.
    unauthorized: 'Vui lòng đăng nhập để tiếp tục.',
    unauthorizedAdmin: 'Tài khoản này không có quyền vào trang quản trị.',
    valueMustBeUnique: 'Giá trị này đã được dùng, hãy chọn giá trị khác.',
    autosaving: 'Không tự lưu được bài. Kiểm tra kết nối rồi bấm "Lưu nháp".',
    correctInvalidFields: 'Vui lòng sửa các trường đang báo lỗi.',
    followingFieldsInvalid_one: 'Trường sau chưa hợp lệ:',
    followingFieldsInvalid_other: 'Các trường sau chưa hợp lệ:',
    notAllowedToPerformAction: 'Bạn không có quyền thực hiện thao tác này.',
    unknown: 'Đã xảy ra lỗi. Vui lòng thử lại.',
    unPublishingDocument: 'Không gỡ được bài. Vui lòng thử lại.',
    unspecific: 'Đã xảy ra lỗi. Vui lòng thử lại.',
  },
  validation: {
    required: 'Bắt buộc nhập.',
    fieldHasNo: 'Trường này chưa có {{label}}.',
    invalidSelection: 'Lựa chọn không hợp lệ.',
    invalidSelections: 'Trường này có lựa chọn không hợp lệ:',
    validUploadID: 'Tệp đã chọn không hợp lệ.',
  },
  version: {
    aboutToRestore:
      'Khôi phục {{label}} về phiên bản {{versionDate}}? Nếu bài đang hiển thị trên site, nội dung khôi phục sẽ được đăng ngay (vẫn qua bước kiểm tra trước khi xuất bản).',
    changedFieldsCount_one: '{{count}} trường đã thay đổi',
    changedFieldsCount_other: '{{count}} trường đã thay đổi',
    confirmVersionRestoration: 'Khôi phục phiên bản',
    publishIn: 'Chỉ xuất bản bản {{locale}}',
    restoreAsDraft: 'Khôi phục thành bản nháp',
    restoredSuccessfully: 'Đã khôi phục phiên bản.',
    aboutToPublishSelection: 'Xuất bản tất cả {{label}} đã chọn?',
    aboutToRevertToPublished: 'Bỏ các thay đổi chưa đăng và quay về bản đang hiển thị trên site?',
    aboutToUnpublish: 'Gỡ bài này khỏi site? Bài vẫn được giữ lại dưới dạng bản nháp.',
    aboutToUnpublishIn: 'Gỡ bản {{locale}} của bài này khỏi site?',
    aboutToUnpublishSelection: 'Gỡ tất cả {{label}} đã chọn khỏi site?',
    autosave: 'Tự lưu',
    autosavedSuccessfully: 'Đã tự lưu.',
    autosavedVersion: 'Bản tự lưu',
    confirmPublish: 'Xuất bản',
    confirmRevertToSaved: 'Quay về bản đã đăng',
    confirmUnpublish: 'Gỡ bài',
    currentDocumentStatus: 'Trạng thái hiện tại: {{docStatus}}',
    currentDraft: 'Bản nháp hiện tại',
    currentlyPublished: 'Đang hiển thị trên site',
    draft: 'Bản nháp',
    draftHasPublishedVersion: 'Bản nháp (đang có bản đã đăng)',
    draftSavedSuccessfully: 'Đã lưu nháp.',
    lastSavedAgo: 'Đã lưu {{distance}} trước',
    publish: 'Xuất bản',
    publishChanges: 'Xuất bản',
    published: 'Đã xuất bản',
    publishing: 'Đang xuất bản…',
    restoreThisVersion: 'Khôi phục phiên bản này',
    revertToPublished: 'Quay về bản đã đăng',
    saveDraft: 'Lưu nháp',
    scheduledSuccessfully: 'Đã hẹn giờ.',
    schedulePublish: 'Hẹn giờ đăng',
    unpublish: 'Gỡ bài',
    unpublished: 'Chưa xuất bản',
    unpublishedSuccessfully: 'Đã gỡ bài khỏi site.',
    unpublishIn: 'Gỡ bản {{locale}}',
    unpublishing: 'Đang gỡ bài…',
    versions: 'Lịch sử phiên bản',
  },
};

// Typed as the hand-written part (a subset of the stock pack keys) for `i18n.translations`.
export const viOverrides = deepMerge(
  respelled(stockVi.translations as unknown as Strings),
  structuredClone(handWritten) as unknown as Strings,
) as unknown as typeof handWritten;

/**
 * Lexical editor labels (toolbar dropdowns, slash menu). richtext-lexical
 * deep-merges each feature's own i18n into `config.i18n.translations` while
 * the config is being sanitised - AFTER `i18n.translations` above - so these
 * are applied to the built config instead (see `applyLexicalOverrides` in
 * payload.config.ts). Keys: `lexical.<featureKey>.<label>`.
 * ("Table" is hard-coded in English by the experimental table feature.)
 */
export const lexicalViOverrides = {
  lexical: {
    general: {
      placeholder: 'Bắt đầu viết, hoặc gõ "/" để chèn tiêu đề, ảnh, video, khối…',
      slashMenuBasicGroupLabel: 'Cơ bản',
      slashMenuListGroupLabel: 'Danh sách',
      toolbarItemsActive: '{{count}} đang bật',
    },
    blocks: {
      label: 'Khối',
      inlineBlocks: { create: 'Chèn {{label}}', edit: 'Sửa {{label}}', label: 'Khối trong dòng', remove: 'Xoá {{label}}' },
    },
    horizontalRule: { label: 'Đường kẻ ngang' },
    upload: { label: 'Ảnh từ thư viện' },
    orderedList: { label: 'Danh sách đánh số' },
    unorderedList: { label: 'Danh sách gạch đầu dòng' },
    checklist: { label: 'Danh sách việc cần làm' },
    blockquote: { label: 'Trích dẫn' },
    paragraph: { label: 'Đoạn văn', label2: 'Đoạn văn thường' },
    indent: { decreaseLabel: 'Giảm thụt lề', increaseLabel: 'Tăng thụt lề' },
    align: { alignCenterLabel: 'Căn giữa', alignJustifyLabel: 'Căn đều hai bên', alignLeftLabel: 'Căn trái', alignRightLabel: 'Căn phải' },
    link: { label: 'Liên kết', loadingWithEllipsis: 'Đang tải…' },
  },
} as const;

type Tree = { [key: string]: unknown };
const mergeInto = (target: Tree, source: Tree) => {
  for (const [key, value] of Object.entries(source)) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const next = (target[key] && typeof target[key] === 'object' ? target[key] : (target[key] = {})) as Tree;
      mergeInto(next, value as Tree);
    } else {
      target[key] = value;
    }
  }
};

/** Re-applies the Lexical labels on top of what the editor features merged in. */
export function applyLexicalOverrides<C extends { i18n?: { translations?: unknown } }>(config: C): C {
  const translations = (config.i18n?.translations ?? {}) as Record<string, Tree>;
  translations.vi ??= {};
  // Plugin / Lexical strings merged during sanitising: same spelling pass.
  mergeInto(translations.vi, respelled(translations.vi as Strings) as unknown as Tree);
  mergeInto(translations.vi, lexicalViOverrides as unknown as Tree);
  return config;
}

/**
 * `folders: true` adds a `folder` relationship whose label Payload hard-codes
 * as "Folder" (payload/dist/folders/buildFolderField.js) and a hidden
 * `payload-folders` collection labelled "Folder(s)" with fields auto-labelled
 * "Name" / "Folder Type" (payload/dist/folders/createFolderCollection.js).
 * Relabel them on the built config so the upload drawers read "Thư mục",
 * "Thêm Thư mục", "Tên thư mục"...
 */
const FOLDER_FIELD_LABELS: Record<string, { vi: string; en: string }> = {
  name: { vi: 'Tên thư mục', en: 'Folder name' },
  folderType: { vi: 'Dùng cho', en: 'Folder type' },
  folder: { vi: 'Thư mục cha', en: 'Parent folder' },
};

export function relabelFolderFields<
  C extends { collections?: { slug?: string; labels?: unknown; fields?: unknown[] }[] },
>(config: C): C {
  for (const collection of config.collections ?? []) {
    const isFolders = collection.slug === 'payload-folders';
    if (isFolders) {
      collection.labels = { singular: { vi: 'Thư mục', en: 'Folder' }, plural: { vi: 'Thư mục', en: 'Folders' } };
    }
    for (const field of (collection.fields ?? []) as { name?: string; type?: string; label?: unknown }[]) {
      if (isFolders && field.name && FOLDER_FIELD_LABELS[field.name]) {
        field.label = FOLDER_FIELD_LABELS[field.name];
      } else if (field.name === 'folder' && field.type === 'relationship' && field.label === 'Folder') {
        field.label = { vi: 'Thư mục', en: 'Folder' };
      }
    }
  }
  return config;
}
