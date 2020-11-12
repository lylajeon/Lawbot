import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  ToastAndroid,
} from "react-native";
import * as Font from "expo-font";
import { MyContext } from "../../context.js";
import Constants from "expo-constants";
import utils from "./Utils.js";
import {StyleOverride} from "./Utils.js";

import colors from "../config/colors";
import Header from "./Header.js";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { documentDirectory } from "expo-file-system";
import { TextInput } from "react-native-gesture-handler";


export default class Board extends Component {
    state = {
        BoardName: "",
        category: 0,
        Contents: [],
        isSearching: false,
    };

    async _loadFonts() {
        await Font.loadAsync({
          SCDream8: require("../assets/fonts/SCDream8.otf"),
          KPWDBold: require("../assets/fonts/KPWDBold.ttf"),
          KPBRegular: require("../assets/fonts/KoPubBatang-Regular.ttf"),
        });
        this.setState({ fontsLoaded: true });
    }

    isFocused = () => {
        this.setState({ category: this.props.route.params.BoardCategory });
        if (this.props.route.params.BoardCategory == 0){
            this.setState({BoardName: "전체 게시판"});
        } else if (this.props.route.params.BoardCategory == 1){
            this.setState({BoardName: "앱 이용 후기 게시판"});
        } else if (this.props.route.params.BoardCategory == 2){
            this.setState({BoardName: "재판 후기 게시판"});
        } else if (this.props.route.params.BoardCategory == 3){
            this.setState({BoardName: "자유 게시판"});
        }
        this.getBoardContents();
    }
        
    componentDidMount() {
       this._loadFonts();
       this.props.navigation.addListener('focus', this.isFocused);
    }

    componentWillUnmount() {
        this.props.navigation.removeListener('focus', this.isFocused);
    }
    componentDidUpdate() {
    }

    async getBoardContents() {
        const ctx = this.context;

        if (this.props.route.params.BoardCategory == 0){
            fetch(`${ctx.API_URL}/boards/posts`, {
                method: "GET",
                headers: {
                    'token': ctx.token,
                },
            }).then((data) => {
                return data.json();
            }).then((result) => {
                this.setState({Contents : result});
            });
        } else{
            fetch(`${ctx.API_URL}/boards/${this.props.route.params.BoardCategory}`, {
                method: "GET",
                headers: {
                    'token': ctx.token,
                },
            }).then((data) => {
                return data.json();
            }).then((result) => {
                this.setState({Contents : result});
            });
        }
    }

    searchSwitch = () => {
        this.setState(prevState => ({isSearching: !prevState.isSearching}), () =>{ToastAndroid.show("Searching " +  `${this.state.isSearching}` , ToastAndroid.SHORT)});
    }

    async searchBoard() {
        if(this.state.serach == "") {
            Alert.alert( "오류", "검색어를 입력해주세요.", [ { text: "알겠습니다."} ]);
        }else {
            const ctx = this.context;
            var body = {};
            body.category = this.state.category;
            // this.props.route.params.category = "";
            // if(this.state.qnaKind === "키워드") {
            //     body.content = -1;
            //     for(var i = 0; i < this.state.categories.length; i++) {
            //         if(this.state.categories[i].name === this.state.qna) {
            //             body.content = this.state.categories[i].ID;
            //             this.props.route.params.category = "#"+this.state.categories[i].name;
            //             break;
            //         }
            //     }
            // }else {
            //     body.content = this.state.search;
            // }

            // await fetch(`${ctx.API_URL}/qna/question/search`, {
            //     method: "POST",
            //     headers: {
            //         "Accept": "application/json",
            //         "Content-Type": "application/json",
            //         "token": ctx.token
            //     },
            //     body: JSON.stringify(body),
            // })
            // .then((res) => {
            //     return res.json();
            // }).then((res) => {
            //     this.searchAgain(res.posts);
            // })
        }
    }

    async contentDetail(content) {
        this.props.navigation.navigate("BoardDetail", {post: content});
    }

    render() {
        const isSearching = this.state.isSearching;

        let boardHead = null;
        if (!isSearching){
            boardHead = styles.boardHead;
        } else {
            boardHead = styles.boardHeadSearching;
        }


        return (
            <View style={styles.container}>
                <Header {...this.props}/>
                {/* <StyleOverride text={"ddddddd"} style={styles.contentBody}>

                </StyleOverride> */}
                <TouchableOpacity style={styles.button} onPress={()=>this.props.navigation.navigate('BoardWrite', this.state.category)}  >                       
                        <Image style={styles.writebuttonimg} source={require("../assets/writeButton.png")} />
                </TouchableOpacity>
                <View style={styles.body}>
                    <View style={styles.board}>
                        <View style={boardHead}>
                            { !this.state.isSearching &&
                                <Text style={styles.boardTitle}>{this.state.BoardName}</Text> 
                            }
                            <TouchableOpacity onPress={() => {this.searchSwitch()}}>
                                <Image source={require("../assets/search.png")} style={styles.search} />
                            </TouchableOpacity>
                            
                            { this.state.isSearching &&
                                <TextInput 
                                placeholder="검색어를 입럭하세요"
                                style={styles.textInput}
                                value={this.state.search}
                                onChangeText={(search) => this.setState({ search })}
                                onSubmitEditing={() => {this.searchBoard()}}
                                returnKeyType="search"
                                style={{left:10,}}
                                />
                            }
                        </View>
                    </View>
                </View>
                <ScrollView style={styles.boardContents}>
                    {this.state.Contents.map((content, idx) => {
                        return(
                            <View style={styles.content} key={idx}>
                                <TouchableOpacity onPress={() => this.contentDetail(content)}>
                                    <Text style={styles.contentTitle}>{content.title} </Text>
                                    <Text style={styles.contentBody}> {content.content} </Text>
                                </TouchableOpacity>
                                <View style={styles.contentInfo}>
                                    <View style={styles.writerInfo}>
                                        <Text style={styles.writeDate}> {utils.dateAgo(content.writtenDate)} </Text>
                                        <Text style={styles.writer}> {utils.nameHide(content.User.userID)} </Text>
                                    </View>
                                    <TouchableOpacity style={styles.scrapViewInfo} onPress={() => {utils.onAddFav(content.ID)}}>
                                        <Image source={require("../assets/scrap.png")} style={styles.scrapImage} />
                                        <Text style={styles.viewNumber}> {content.views} </Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.thinUnderline}></View>
                            </View>
                        )
                    })}
                </ScrollView>
            </View>
        );
    }
}
Board.contextType = MyContext;

const styles=StyleSheet.create({
    body: {
        paddingLeft:"5%",
        paddingRight:"5%",
      },
    container: {
        flex: 1,
        marginTop: Platform.OS === `ios` ? 0 : Constants.statusBarHeight,
        backgroundColor: "#fff",
    },
    board: {
        paddingLeft: "5%",
        paddingRight: "5%",
        paddingTop: "10%",
    },
    boardHead: {
        flexDirection:"row",
        marginBottom: "10%",
        justifyContent: "space-between",
        marginBottom: 20,
        height: 30,
    },
    boardHeadSearching: {
        flexDirection:"row",
        marginBottom: "10%",
        marginBottom: 20,
        height: 30,
    },
    boardTitle: {
        fontFamily: "KPWDBold",
        fontSize: 18,
    },
    contentTitle: {
        fontFamily: "KPWDMedium",
        fontSize: 16,
    },
    search : {
        width:30,
        height:30,
    },
    boardContents: {
        overflow: "scroll",
        paddingLeft: "5%",
        paddingRight: "5%",
    },
    content: {
        paddingLeft: "3%",
        paddingRight: "3%",
        marginBottom: 30,
    },
    contentBody: {
        fontFamily: "KPWDMedium",
        fontSize: 12,
        color: "#BCBCBC",
        overflow: "hidden",
        height: 48,
        marginBottom: 5,
    },
    contentInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    writerInfo: {
        flexDirection: "row",
    },
    scrapViewInfo: {
        flexDirection: "row",
    },
    writeDate: {
        fontFamily: "SCDream8",
        fontSize: 12,
        color: "#EDEDED",
    },
    writer: {
        fontFamily: "SCDream8",
        fontSize: 12,
        color: "#EDEDED",
    },
    scrapImage: {
        width: 15,
        height: 15,
        opacity: 0.8,
        right: 10,
    },
    viewNumber: {
        fontFamily: "SCDream8",
        fontSize: 12,
        color: "#EDEDED",
    },
    thinUnderline : {
        paddingLeft: "0%",
        paddingRight: "0%",
        height: 1,
        backgroundColor: "#E7E7E7",
        alignSelf: "center",
        borderRadius: 10,
    },
    button: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        zIndex: 1,
    
        // backgroundColor: "yellow",
    }, 
    writebuttonimg: {
        width: 100,
        height: 100,
    },
    textInput : {
        fontSize: 16,
        fontFamily: "KPWDBold",
        fontWeight: "400",
        color: "#8D8D8D",
        width: 180,
    },
    testButton: {
        backgroundColor: colors.secondary,
        borderRadius: 8,
        alignSelf: "center",
        paddingVertical: 3,
        paddingHorizontal: 10,
    },    
});