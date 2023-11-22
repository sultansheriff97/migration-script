const fs = require("fs");
const {
  map,
  length,
  uniq,
  compose,
  dissoc,
} = require("ramda");

const path = require('path');
const data = require("./input.json");

const flows = [].concat(JSON.parse(data.flow).flows);

const getFileNameAndPath = (filePath) =>{
  const fileName = path.basename(filePath);
  const dirPath = path.dirname(filePath)
  return{
    filename: fileName,
    directory: dirPath
  }
}

const parserConverter = (block) => {
  if (block.type === "xml") {
    return { ...block, _converted: true };
  } else if (block.type === "csv") {
    return { ...block, _converted: true };
  } else if (block.type === "json") {
    return { ...block, _converted: true };
  }
  return block;
};

const converter = (block) => {
  if (block.type === "tab") {
    return { ...block, _converted: true };
  } else if (block.type.startsWith("subflow:")) {
    return { ...block, _converted: true };
  } else if (block.type === "subflow") {
    return { ...block, _converted: true };
  } else if (block.type === "task summary") {
    console.log("!!! - NEW BLOCK NOT FOUND - !!! => task summary");
  } else if (block.type === "popup data") {
    return {
      ...block,
      _converted:true,
      type: "popup"
    }
  } else if (block.type === "custom http request") {
    return { ...block, type: "http request", _converted: true };
  } else if (block.type === "debug-start") {
    return {
      ...block,
      type: "start",
      _converted: true,
    };
  } else if (block.type === "start") {
    return { ...block, _converted: true };
  } else if (block.type === "end") {
    return { ...block, _converted: true };
  } else if (block.type === "debug") {
    return {
      ...block,
      type: "print",
      _converted: true,
    };
  } else if (block.type === "catch") {
    return { ...block, _converted: true };
  } else if (block.type === "function") {
    return {
      ...block,
      type: "execute javascript",
      _converted: true,
    };
  } else if (block.type === "switch") {
    return { ...block, _converted: true };
  } else if (block.type === "change") {
    return {
      ...block,
      type: "set variables",
      _converted: true,
    };
  } else if (block.type === "counter-loop") {
    return { ...block, _converted: true };
  } else if (block.type === "array-loop") {
    return { ...block, _converted: true };
  } else if (block.type === "link in") {
    return { ...block, _converted: true };
  } else if (block.type === "link call") {
    return { ...block, _converted: true };
  } else if (block.type === "link out") {
    return { ...block, _converted: true };
  } else if (block.type === "comment") {
    return { ...block, _converted: true };
  } else if (block.type === "delay") {
    return { ...block, _converted: true };
  } else if (block.type === "screenshot") {
    return {
      ...block,
      filePath: block.file_path,
      fileName: block.file_name,
      action: "entireScreen",
      _converted: true,
    };
  } else if (block.type === "file in") {
    return { ...block, _converted: true };
  } else if (block.type === "file") {
    return { ...block, _converted: true };
  } else if (block.type === "custom python"){
    return {
      ...block,
      _converted: true,
      type: "execute python"
    }
  }
  return block;
};

const browserConverter = (block) => {
  if (block.type === "close browser") {
    return { ...block, _converted: true };
  } else if (block.type === "launch browser") {
    const new_block = {...block}
    new_block.type = "launch browser";
    if (block.selectBrowser === "chrome"){
      new_block.browser = "google_chrome";
    } else if (block.selectBrowser === "firefox"){
      new_block.browser = "mozilla_firefox"
    }else if (block.selectBrowser === "edge"){
      new_block.browser = "microsoft_edge"
    }else if (block.selectBrowser === "internet_explorer"){
      new_block.browser = "internet_explorer"
    }
    new_block.browserMode = "with-gui"
    new_block.userProfilePath = block.openWithProfile
    new_block._converted = true
    return new_block
  } else if (block.type === "new tab") {
    return { ...block, _converted: true };
  } else if (block.type === "reload tab") {
    const new_block = {...block}
    new_block.type = "refresh tab";
    new_block.tab_index = "";
    new_block._converted = true
    return new_block
  } else if (block.type === "close tab") {
    const new_block = {...block, _converted: true}
    if (block.tab_index === "0"){
      new_block.tab_index = "1"
    } else {
        new_block.tab_index = block.tab_index
    return new_block
    }
  } else if (block.type === "duplicate tab") {
    return {...block, _converted: true}
  } else if (block.type === "switch tab") {
    const new_block = {...block}
    if (block.switch_page === "0"){
      new_block.switch_page = "1"
    }else{
      new_block.switch_page = block.switch_page
    }
    new_block._converted = true
    return new_block
  } else if (block.type === "goto") {
    return {
      ...block,
      type: "goto",
      url: block.url,
      continueOnError: false,
      _converted: true,
    };
  } else if (block.type === "get page url") {
    return {...block, _converted:true}
  } else if (block.type === "go back") {
    const new_block = {...block}
    new_block.type = "browser navigation"
    new_block.navigation_type = "back"
    new_block._converted = true
    return new_block
  } else if (block.type === "click") {
    return { ...block, _converted: true };
  } else if (block.type === "type") {
    const new_block = {...block}
    new_block.type = "type on specific input"
    new_block._converted = true
    return new_block
  } else if (block.type === "clear value") {
    return {...block, _converted:true}
  } else if (block.type === "query selector") {
    const new_block = {...block, _converted:true}
    new_block.type = "get attribute value"
    return new_block
  } else if (block.type === "copy text") {
    const new_block = {...block, _converted:true}
    new_block.type = "get text"
    return new_block
  } else if (block.type === "focus") {
    // 
  } else if (block.type === "element length") {
    return {
      ...block,
      type: "get child elements",
      elementPath: block.data,
      pathType: block.select_type,
      waitFor: block.wait_time,
      _converted: true,
    };
  } else if (block.type === "switch iframe") {
    return {
      ...block,
      select_type: "xpath",
      xpath: block.xpath,
      wait_time: "30",
      _converted: true,
    };
  } else if (block.type === "exit iframe") {
    const new_block = {...block, _converted:true}
    if (block.switch_to === "parent iframe"){
      new_block.switchTo = "parent_iframe"
    }else if (block.switch_to === "default content"){
      new_block.switchTo = "default_content"
    }
    return new_block
  } else if (block.type === "scroll to element") {
    return {
      ...block,
      _converted:true,
      data: block.element_path,
      select_type: block.path_type
    }
  } else if (block.type === "action chain") {
    return {...block, _converted:true}
  } else if (block.type === "waitFor") {
    return { ...block, _converted: true };
  }
  return block;
};

const excelConverter = (block) => {
  if (block.type === "excel filter") {
    const new_block = {...block, _converted:true}
    new_block.filter_type = block.filter_condition
    new_block.sortType = block.sort_type
    if (block.filter_sheet_name !== ""){
      new_block.newSheetName = block.filter_sheet_name
      new_block.saveAsNewSheet = "1"
    }else {
      new_block.newSheetName = block.filter_sheet_name
      new_block.saveAsNewSheet = "1"
    }
    return new_block
  } else if (block.type === "read cell") {
    const new_block = {...block, _converted:true}
    new_block.type = "read cells",
    new_block.name = block.display_name
    return new_block
  } else if (block.type === "read range") {
    const new_block = {...block, _converted:true}
    new_block.type = "read cells",
    new_block.sheet_name = block.worksheet_name
    if (block.start_cell_reference !== "" && block.end_cell_reference !== ""){
      new_block.cell_reference = block.start_cell_reference+":"+block.end_cell_reference
    }else if (block.start_cell_reference !== "" && block.end_cell_reference === ""){
      new_block.cell_reference = block.start_cell_reference
    }else{
      new_block.cell_reference = block.start_cell_reference
    }
    return new_block
  } else if (block.type === "read column") {
    const new_block = {...block, _converted:true}
    new_block.type = "read cells",
    new_block.file_path = block.excel_dir_path
    new_block.cell_reference = block.column_name
    return new_block
  } else if (block.type === "read row") {
    const new_block = {...block, _converted:true}
    new_block.type = "read cells",
    new_block.cell_reference = block.row_index
    return new_block
  } else if (block.type == "write cell") {
    return {
      ...block,
      type: "write cells",
      file_path: block.file_path,
      sheet_name: block.sheet_name,
      cell_reference: block.cell_reference,
      value: block.value,
      _converted: true,
    };
  } else if (block.type === "write row") {
    return {
      ...block,
      type: "write cells",
      file_path: block.write_row_path,
      sheet_name: block.row_sheet_name,
      cell_reference: `${block.write_row_index}:${block.write_column_index}`,
      value: block.write_value,
      _converted: true,
    };
  } else if (block.type === "write range") {
    return {
      ...block,
      type: "write cells",
      file_path: block.file_path,
      sheet_name: block.sheet_name,
      cell_reference: block.start_range,
      value: block.cell_value,
      _converted: true,
    };
  } else if (block.type === "write column") {
    return {
      ...block,
      type: "write cells",
      file_path: block.write_column_path,
      sheet_name: block.col_sheet_name,
      _converted: true,
    };
  } else if (block.type === "close excel") {
    return { ...block, _converted: true };
  } else if (block.type === "open excel") {
    console.log("!!! - NEW BLOCK NOT FOUND - !!! => open excel");
  } else if (block.type === "add worksheet"){
    const new_block = {...block, _converted:true}
    new_block.type = "create sheet",
    new_block.name = block.display_name,
    new_block.sheetName = block.worksheet_name,
    new_block.index = block.index_number
    return new_block
  } else if (block.type === "bold range"){
    return {...block, type: "bold cells", _converted:true}
  } else if (block.type === "border range"){
    return {...block, type: "border cells", border_style: block.line_style,_converted:true}
  } else if (block.type === "color range"){
    return {...block, type: "color cells", _converted:true}
  } else if (block.type === "delete cell"){
    return {...block, 
      type: "clear cells",
      file_path: block.delete_cell_file_path,
      cell_reference: block.delete_cell_reference,
     _converted: true}
  } else if (block.type === "delete range"){
    return {...block, 
      type: "clear cells",
      file_path: block.delete_range_file_path,
      cell_reference: block.start_delete_range_reference+":"+block.end_delete_range_reference,
     _converted: true}
  } else if (block.type === "delete worksheet"){
    return {
      ...block,
      _converted:true,
      name: block.display_name,
      type: "delete sheet",
      sheet_name: block.worksheet_name,
    }
  } else if (block.type === "get workbook sheets"){
    const new_block = {
      ...block,
      _converted:true,
      type: "get sheets",
      name: block.display_name,
      file_path: block.sheet_name_file_path,
    }
    if (block.sheet_option === "All"){
      new_block.sheetType = "all"
    } else if (block.sheet_option === "Hidden"){
      new_block.sheetType = "hidden"
    } else if (block.sheet_option === "Visible"){
      new_block.sheetType = "visible"
    }
    return new_block
  } else if (block.type === "hide or unhide worksheet"){
    if (block.HIDE_UNHIDE === "Hide"){
      return {
        ...block,
        _converted: true,
        type: "hide sheet",
        name: block.display_name,
        sheet_name: block.worksheet_name
      }
    }else if (block.HIDE_UNHIDE === "UnHide"){
      return {
        ...block,
        _converted: true,
        type: "show sheet",
        name: block.display_name,
        sheet_name: block.worksheet_name
      }
    }
  } else if (block.type === "insert or delete row"){
    if(block.ADD_DELETE === "Add"){
      return {
        ...block,
        _converted: true,
        type: "insert row",
        name: block.display_name,
        cell_reference: block.row_insert,
        count: block.no_insert
      }
    }
    else if (block.ADD_DELETE === "Delete"){
      return {
        ...block,
        _converted: true,
        type: "show row",
        name: block.display_name,
        cell_reference: block.row_insert,
      }
    }
  } else if (block.type === "insert or delete column"){
    if(block.ADD_DELETE === "Add"){
      return {
        ...block,
        _converted: true,
        type: "insert column",
        name: block.display_name,
        cell_reference: block.cols_insert,
        count: block.no_insert
      }
    }
    else if (block.ADD_DELETE === "Delete"){
      return {
        ...block,
        _converted: true,
        type: "show column",
        name: block.display_name,
        cell_reference: block.cols_insert,
      }
    }
  } else if (block.type === "insert range"){
    
  } else if (block.type === "read formula from a cell"){
    return {
      ...block,
      _converted: true,
      type: "read formula",
      name: block.display_name,
      sheet_name: block.worksheet_name
    }
  } else if (block.type === "rename worksheet"){
    return{
      ...block,
      _converted: true,
      type: "rename sheet",
      name: block.display_name,
      sheet_name: block.worksheet_name,
      new_sheet_name: block.rename_worksheet
    }
  } else if (block.type === "write formula into a cell "){
    return{
      ...block,
      _converted: true,
      type: "write formula",
      name: block.display_name,
      sheet_name: block.worksheet_name,
    }
  } else if (block.type === "find cell"){
    return {
      ...block,
      _converted:true,
      value: block.cell_reference
    }
  } else if (block.type === "find and replace" ){
    return {
      ...block,
      _converted: true,
      sheet_name: block.worksheet_name,
      value: block.find_val,
      replace_value: block.replace_val
    }
  }
  return block;
};

const folderConverter = (block) => {
  if (block.type === "create folder") {
    return {
      ...block,
      type: "create folder",
      path: block.path,
      folderName: block.name,
      _converted: true,
    };
  } else if (block.type === "check folder exists") {
    return {
      ...block,
      type: "check folder",
      path: block.path,
      folderName: block.name,
      _converted: true,
    };
  } else if (block.type === "delete folder") {
    return {
      ...block,
      _converted: true,
      path: block.parent_dir_path,
      folderName: block.folder_name
    }
  } else if (block.type === "move folder"){
    const srcGetNameAndPath = getFileNameAndPath(block.source_dir_path)
    const desGetNameAndPath = getFileNameAndPath(block.dest_dir_path)
    return {
      ...block,
      _converted: true,
      sourcePath: srcGetNameAndPath.directory,
      sourceFolderName: srcGetNameAndPath.filename,
      destinationPath: desGetNameAndPath.directory,
      destinationFolderName: desGetNameAndPath.filename
    }
  } else if (block.type === "rename folder"){
    return {
      ...block,
      _converted: true,
      name: block.d_name,
      path: block.src_path,
      folderName: block.old_folder,
      newFolderName: block.new_folder
    }
  } else if (block.type === "zip folder"){
    const getNameAndPath = getFileNameAndPath(block.destination_path)
    return {
      ...block,
      _converted: true,
      sourcePath: block.source_path,
      folderName: block.folder_name,
      destPath: getNameAndPath.directory,
      zipFileName: getNameAndPath.filename
    }
  } else if (block.type === "copy folder"){
    const srcGetNameAndPath = getFileNameAndPath(block.source)
    const desGetNameAndPath = getFileNameAndPath(block.destination)
    return {
      ...block,
      _converted: true,
      type: "duplicate folder",
      sourcePath: srcGetNameAndPath.directory,
      sourceFolderName: srcGetNameAndPath.filename,
      destinationPath: desGetNameAndPath.directory,
      destinationFolderName: desGetNameAndPath.filename
    }
  } else if (block.type === "list all file and folder names"){
    return {
      ...block,
      _converted: true,
      type: "list folder contents",
      name: block.d_name,
      contentType: block.select_type,
      contentSort: "created",
      sortType: "descending"
    }
  } else if (block.type === "unzip folder"){
    const srcGetNameAndPath = getFileNameAndPath(block.source_unzip_dir_path)
    const desGetNameAndPath = getFileNameAndPath(block.dest_unzip_dir_path)
    return {
      ...block,
      _converted: true,
      sourcePath: srcGetNameAndPath.directory,
      zipFileName: srcGetNameAndPath.filename,
      destPath: desGetNameAndPath.directory,
      folderName: desGetNameAndPath.filename
    }
  }

  return block;
};

const fileConverter = (block) => {
  if (block.type === "check file exists") {
    return {
      ...block,
      name: block.display_name,
      type: "check file",
      path: block.parent_dir_path,
      _converted: true,
    };
  } else if (block.type === "create file") {
    return {
      ...block,
      type: "create file",
      name: block.display_name,
      path: block.parent_dir_path,
      fileName: `${block.file_name}${block.file_extension}`,
      _converted: true,
    };
  } else if (block.type === "delete file"){
    const getNameAndPath = getFileNameAndPath(block.source)
    return {
      ...block,
      _converted: true,
      name: block.display_name, 
      path: getNameAndPath.directory,
      fileName: getNameAndPath.filename
    }
  } else if (block.type === "move file"){
    const srcGetNameAndPath = getFileNameAndPath(block.source)
    const desGetNameAndPath = getFileNameAndPath(block.destination)
    return {
      ...block,
      _converted: true,
      name: block.display_name,
      sourcePath: srcGetNameAndPath.directory,
      sourceFileName: srcGetNameAndPath.filename,
      destinationPath: desGetNameAndPath.directory,
      destinationFileName: desGetNameAndPath.filename
    }
  } else if (block.type === "rename file"){
    const getNameAndPath = getFileNameAndPath(block.parent_dir_path)
    return {
      ...block,
      _converted: true,
      name: block.display_name,
      path: getNameAndPath.directory,
      fileName: getNameAndPath.filename,
      newFileName: block.new_file_name
    }
  } else if (block.type === "copy and paste file"){
    const srcGetNameAndPath = getFileNameAndPath(block.source)
    const desGetNameAndPath = getFileNameAndPath(block.destination)
    return {
      ...block,
      _converted: true,
      type: "duplicate file",
      name: block.display_name,
      sourcePath: srcGetNameAndPath.directory,
      sourceFileName: srcGetNameAndPath.filename,
      destinationPath: desGetNameAndPath.directory,
      destinationFileName: desGetNameAndPath.filename
    }
  } else if (block.type === "save text to file"){
    const getNameAndPath = getFileNameAndPath(block.parent_dir_path)
    return {
      ...block,
      _converted: true,
      type: "write text to file", 
      name: block.display_name,
      path: getNameAndPath.directory,
      fileName: getNameAndPath.filename,
      text: block.write_text,
      action: "append"
    }
  } else if (block.type === "read config file"){
    return {
      ...block,
      _converted: true,
      path: block.file_path,
      fileName: ""
    }
  }
  return block;
};

const stringConverter = (block) => {
  return block;
};

const listConverter = (block) => {
  if (block.type === "append") {
    return { ...block, _converted: true };
  }
  return block;
};

const objectConverter = (block) => {
  return block;
};

const conversionConverter = (block) => {
  return block;
};

const mouseConverter = (block) => {
  if (block.type === "mouse click") {
    return {
      ...block,
      type: "mouse click",
      clickType: "click",
      xCoordinate: block.x_coordinate,
      yCoordinate: block.y_coordinate,
      delay: block.delay,
      _converted: true,
    };
  } else if (block.type === "right click") {
    return {
      ...block,
      type: "mouse click",
      clickType: "right_click",
      xCoordinate: block.x_coordinate,
      yCoordinate: block.y_coordinate,
      delay: block.delay,
      _converted: true,
    };
  } else if (block.type === "double click") {
    return {
      ...block,
      type: "mouse click",
      clickType: "double_click",
      xCoordinate: block.x_coordinate,
      yCoordinate: block.y_coordinate,
      delay: block.delay,
      _converted: true,
    };
  } else if (block.type === "get mouse coordinates") {
    return {
      ...block,
      type: "get mouse coordinates",
      delay: block.delay_mouse,
      _converted: true,
    };
  }
  return block
};

const keyboardConverter = (block) => {
  if (block.type === "press key combinations") {
    return {
      ...block,
      type: "press key combination",
      keyOne: block.first_key,
      keyTwo: block.second_key,
      keyThree: block.third_key,
      _converted: true,
    };
  } else if (block.type === "press key"){
    return {
      ...block, 
      _converted: true,
      key: block.press_key,
      repeat: block.repeat_key
    }
  } else if (block.type === "type text"){
    return {
      ...block,
      _converted: true,
      text: block.type_your_text,
      delay: "5"
    }
  }

  return block;
};

const desktopConverter = (block) => {
  if (block.type === "close window") {
    return {
      ...block,
      type: "close window",
      delay: block.delay,
      _converted: true,
    };
  } else if (block.type === "get window title"){
    return{
      ...block,
      _converted: true,
    }
  } else if (block.type === "launch desktop application"){
    return {
      ...block,
      _converted: true,
      applicationPath: block.application_path,
      delay: "5"
    }
  }
  return block;
};

const imageConverter = (block) => {
  if (block.type === "image click-double click"){
    const new_block = {...block, _converted:true}
    new_block.type =  "image click",
    new_block.imagePath = block.image_path
    if (block.click === "Single Click"){
      new_block.clickType = "click"
    } else if (block.click === "Double Click"){
      new_block.clickType = "double_click"
    }
    return new_block
  } else if (block.type === "waitfor image"){
    return {
      ...block,
      _converted:true,
      type: "wait for image",
      imagePath: block.image_path,
    }
  }
  return block;
};

const pdfConverter = (block) => {
  if (block.type === "PDF type identifier"){
    return {
      ...block,
      _converted: true,
      type: "is searchable pdf",
      filePath: block.file_path
    }
  }
  return block;
};

const dbConverter = (block) => {
  if (block.type === "truncate datatable") {
    return {
      ...block,
      type: "delete table",
      name: block.display_name,
      database: block.type_conn,
      hostName: block.hostname,
      portNumber: block.port,
      userName: block.username,
      password: block.password,
      databaseName: block.databaseName,
      tableName: block.tableName,
      _converted: true,
    };
  } else if (block.type === "build table") {
    console.log(block, "BLOCK")
    return {
      ...block,
      type: "create table",
      name: block.display_name,
      database: block.type_conn,
      hostName: block.hostname,
      portNumber: block.port,
      userName: block.username,
      password: block.password,
      databaseName: block.databaseName,
      tableName: block.tableName,
      columns: block.columns.map((col) => {
        return {
          columnName: col.column_name,
          dataType: col.column_type,
          maxLength: col.max_length,
          defaultValue: col.default_value,
          autoIncremenet: col.auto_increment,
          isPrimary: col.is_primary,
          isNullable: col.is_nullable,
          isUnique: col.is_unique,
        };
      }),
      _converted: true,
    };
  } else if (block.type === "drop datatable") {
    return {
      ...block,
      type: "delete table",
      database: "sqlite",
      name: block.display_name,
      database: block.type_conn,
      hostName: block.hostname,
      portNumber: block.port,
      userName: block.username,
      password: block.password,
      databaseName: block.databaseName,
      tableName: block.tableName,
      _converted: true,
    };
  } else if (block.type === "free flow query") {
    return {
      ...block,
      type: "execute query",
      name: block.display_name,
      database: block.sql_type,
      hostName: block.host_name,
      portNumber: block.port,
      userName: block.user_name,
      password: block.password,
      databaseName: block.database_name,
      tableName: block.tableName,
      query: block.query,
      _converted: true,
    };
  } else if (block.type === "write data into datatable") {
    return {
      ...block,
      type: "insert data",
      name: block.display_name,
      database: block.type_conn,
      hostName: block.host_name,
      portNumber: block.port,
      userName: block.user_name,
      password: block.password,
      databaseName: block.databaseName,
      tableName: block.tableName,
      columns: block.columns.map((col) => {
        return {
          columnName: col.column_name,
          value: col.column_value,
        };
      }),
      _converted: true,
    };
  } else if (block.type === "insert excel to datatable") {
    console.log("!!! - NEW BLOCK NOT FOUND - !!! => insert excel to datatable");
  } else if (block.type === "merge datatable") {
    console.log("!!! - NEW BLOCK NOT FOUND - !!! => merge datatable");
  } else if (block.type === "read data from datatable") {
    return {
      ...block,
      type: "read data",
      name: block.display_name,
      database: block.type_conn,
      hostName: block.hostname,
      portNumber: block.port,
      userName: block.username,
      password: block.password,
      databaseName: block.databaseName,
      tableName: block.tableName,
      Conditions: [
        {
          column: block.condition_col_name,
          condition: "Equals",
          value: block.condition_value,
        },
      ],
      _converted: true,
    };
  } else if (block.type === "remove data column") {
    console.log("!!! - NEW BLOCK NOT FOUND - !!! => remove data column");
  } else if (block.type === "remove data row") {
    console.log("!!! - NEW BLOCK NOT FOUND - !!! => remove data row");
  } else if (block.type === "remove duplicate rows") {
    console.log("!!! - NEW BLOCK NOT FOUND - !!! => remove duplicate rows");
  } else if (block.type === "sort data from datatable") {

  } else if (block.type === "update to datatable") {
    return {
      ...block,
      type: "update data",
      name: block.display_name,
      database: block.type_conn,
      hostName: block.hostname,
      portNumber: block.port,
      userName: block.username,
      password: block.password,
      databaseName: block.databaseName,
      tableName: block.tableName,
      columns: [
        {
          column: block.column_name,
          value: block.column_value,
        },
      ],
      conditions: [{ column: block.col_name, condition: "Equals", value: "" }],
      _converted: true,
    };
  } else if (block.type === "upsert data") {

  }

  return block;
};

const continueOnErrorConverter = (block) => {
  return {
    ...block,
    continueOnError: false,
  };
};

console.log("-------------------------------------------------");
console.log("-------------------------------------------------");
console.log("-------------------------------------------------");

const output = compose(
  map(parserConverter),
  map(converter),
  map(browserConverter),
  map(excelConverter),
  map(folderConverter),
  map(fileConverter),
  map(stringConverter),
  map(listConverter),
  map(objectConverter),
  map(conversionConverter),
  map(desktopConverter),
  map(imageConverter),
  map(pdfConverter),
  map(mouseConverter),
  map(keyboardConverter),
  map(dbConverter),
  map(continueOnErrorConverter)
)(flows);

console.log("-------------------------------------------------");
console.log("-------------------------------------------------");
console.log("-------------------------------------------------");

const result = {
  id: data.id,
  task: data.task,
  name: data.name,
  location: data.location,
  description: data.description,
  version: data.version,
  baseVersion: data.baseVersion,
  flow: JSON.stringify({
    flows: output.map((block) =>
      dissoc("_converted", dissoc("continueOnError", block))
    ),
  }),
  versions: data.version,
  isDeleted: data.isDeleted,
  isDraft: data.isDraft,
  createdAt: data.createdAt,
  updatedAt: data.updatedAt,
};

const resultJson = JSON.stringify(result, null, 2); // Convert the JSON data to a string with pretty printing

fs.writeFile("output.json", resultJson, (err) => {
  if (err) throw err;
  console.log("Data written to file!");
});

// console.log(result);

const totalBlocks = length(flows);
const blockNames = map((block) => block.type, flows);

const uniqBlocks = uniq(blockNames);
const totaluniqBlocks = length(uniqBlocks);

const convertedblocks = output.filter((e) => e._converted == true);

const unconvertedblocks = output.filter((e) => !e._converted);

flows
  .filter((block) => block.type === "custom htp request")
  .forEach((block) => {
    console.log(block);
  });

console.log(
  "totalBlocks:::",
  totalBlocks,
  length(convertedblocks) + length(unconvertedblocks) === totalBlocks
    ? ""
    : "Something wrong in block conversion"
);
console.log("totaluniqBlocks:::", totaluniqBlocks);
console.log("totalConvertedBlocks:::", length(convertedblocks));
console.log("totalUNConvertedBlocks:::", length(unconvertedblocks));
console.log(
  "unconverted unique blocks count",
  length(uniq(map((block) => block.type, unconvertedblocks)))
);
console.log(
  "unconverted blocks matrix",
  unconvertedblocks.reduce((accum, val) => {
    if (accum[val.type]) {
      accum[val.type] = accum[val.type] + 1;
      return accum;
    } else {
      accum[val.type] = 1;
      return accum;
    }
  }, {})
);

console.log("-------------------------------------------------");

for (let index = 0; index == 100; index++) {
  const element = array[index];
}

[].forEach;