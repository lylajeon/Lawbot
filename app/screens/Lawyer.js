import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Modal,
  Platform,
  ToastAndroid,
  Alert,
  Keyboard
} from "react-native";
import {vw, vh, vmin, vmax} from 'react-native-expo-viewport-units';
import * as Font from "expo-font";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import * as ImageManipulator from "expo-image-manipulator";
import { MyContext } from "../../context.js";

import colors from "../config/colors";
import Header2 from "./Header2.js";
import { DrawerContentScrollView } from "@react-navigation/drawer";




const categories=[
    "자동차",  "산업재해",  "환경", "언론보도", "지식재산권", "의료", "건설", "국가", "기타", "가족/가정", "이혼", "폭행", "사기", "성범죄", "명예훼손", "모욕", "협박", "교통사고", "계약", "개인정보", "상속", "재산범죄", "매매", "노동", "채권추심", "회생/파산", "마약/대마", "소비자", "국방/병역", "학교", "주거침입", "도급/용역", "건설/부동산", "위증", "무고죄", "아동/소년범죄", "임대차", "대여금", "온라인범죄","음주운전"   
]

const catImgList=[
    require("../assets/carAccident.png"), require("../assets/industrialAccident.png"), require("../assets/environment.png"),require("../assets/press.png"), require("../assets/intellectualProperty.png"),  require("../assets/medical.png"), require("../assets/construction.png"),require("../assets/government.png"), require("../assets/etc.png"), require("../assets/family.png"), require("../assets/divorce.png"), require("../assets/violence.png"), require("../assets/fraud.png"),require("../assets/sexualAssault.png"),  require("../assets/libel.png"), require("../assets/insult.png"), require("../assets/threat.png"), require("../assets/carAcci.png"), require("../assets/contract.png"), require("../assets/personalInformation.png"), require("../assets/inheritance.png"), require("../assets/burglary.png"),  require("../assets/trading.png"), require("../assets/labor.png"), require("../assets/debtCollection.png"), require("../assets/bankruptcy.png"), require("../assets/drug.png"), require("../assets/consumer.png"), require("../assets/millitary.png"), require("../assets/school.png"),require("../assets/housebreaking.png"),  require("../assets/service.png"), require("../assets/realEstate.png"), require("../assets/falseWitness.png"), require("../assets/falseAccusation.png"),require("../assets/juvenile.png"), require("../assets/lease.png"), require("../assets/loan.png"), require("../assets/online.png"), require("../assets/drunkDriving.png")
]

const empty="     ";

export default class Lawyer extends Component {
    constructor(props) {
        super(props);
        this.state = {
          fontsLoaded: false,
          fields: "",
          token:"",
          home: true,
          info: false,
          qa: false,
          id: "",
          lawyer: {},
          answers: [],
          tabs: [
              {
                  name: "홈",
                  selected: true
              },
              {
                  name: "변호사 정보",
                  selected: false
              },
              {
                  name: "QA 답변",
                  selected: false
              }
          ]
        };
    }

  async _loadFonts() {
    await Font.loadAsync({
      SCDream8: require("../assets/fonts/SCDream8.otf"),
      KPWDBold: require("../assets/fonts/KPWDBold.ttf"),
      KPBRegular: require("../assets/fonts/KoPubBatang-Regular.ttf"),
      KPWDMedium: require("../assets/fonts/KPWDMedium.ttf"),
      KPBBold: require("../assets/fonts/KoPubBatang-Bold.ttf"),
      KPBLight: require("../assets/fonts/KoPubBatang-Light.ttf"),
      KPBRegular: require("../assets/fonts/KoPubBatang-Regular.ttf"),
    });
    this.setState({ fontsLoaded: true });
  }

  async getLawyerData(id) {
    const ctx = this.context;
    // var newLawyer;
    // var newAnswers;
    this.setState({id: id, home:true, info: false, qa:false});

    await fetch(`${ctx.API_URL}/lawyer/${id}`, {
        method: "GET",
        headers: {
            'token': ctx.token,
        },
      }
      ).then((result) => {
        return result.json();
      }).then((result) => {
        this.setState({ lawyer: result[0] });
    });

   await fetch(`${ctx.API_URL}/lawyer/answer/${id}`, {
    method: "GET",
    headers: {
        'token': ctx.token,
    },
    }).then((result) => {
        return result.json();
    }).then((result) => {
        this.setState({ answers: result });
        // this.setState({ token: ctx.token, user: result });
    });
  }

  isFocused = () => {
    this.getLawyerData(this.props.route.params.id);
  }

  componentDidMount() {
    this._loadFonts();
    this.props.navigation.addListener('focus', this.isFocused);
  }

  componentWillUnmount() {
    this.props.navigation.removeListener('focus', this.isFocused);
  }

//    async getCategory() {
//     const ctx = this.context;
//     console.log("hi");
//      fetch(`${ctx.API_URL}/qna/category`, {
//         method: "GET",
//         headers: {
//             'token': ctx.token,
//         },
//     }
//     ).then((result) => {
//         return result.json();
//     }).then((result) => {
//         // console.log(result);
//         fields=result;
//         // this.setState({ token: ctx.token, user: result });
//     });
// };

// async componentDidUpdate() {
//     const ctx = this.context;
//     if(this.props.route.params.id !== this.state.id) {
//         this.getLawyerData();
//     // this.getCategory();
//     // this.setState({lawyer: this.props.route.params.lawyer, answers: this.props.route.params.answers});
//   }
// }

//   async componentDidUpdate() {
//     const ctx = this.context;
//     if(this.state.token != ctx.token && ctx.token != '') {
//       await fetch(`${ctx.API_URL}/lawyer/1`, {
//         method: "GET",
//         headers: {
//             // 'Content-Type': 'multipart/form-data',
//             // 'Accept': 'application/json',
//             'token': ctx.token,
//         },
//       }).then((result) => {
//         return result.json();
//       }).then((result) => {
//         this.setState({ token: ctx.token, lawyer: result[0] });
//         console.log(this.state.lawyer.User.name)
//       });
//     }
//   }


    // getQA() {
    //     const ctx = this.context;
    //     console.log("hi");
    //     fetch(`${ctx.API_URL}/lawyer/answer/1`, {
    //         method: "GET",
    //         headers: {
    //             'token': ctx.token,
    //         },
    //     }
    //     ).then((result) => {
    //         return result.json();
    //     }).then((result) => {
    //         // console.log(result);
    //         // this.setState({ token: ctx.token, user: result });
    //     });
    // }

    async handleTabs(which) {
        if (which==="home") {
            this.setState({home:true, info:false, qa: false})
            // this.getLawyerInfo();
            
        } else if (which==="info") {
            this.setState({home:false, info:true, qa: false})
            // this.getCategory();

        } else {
            // this.getQA();
            this.setState({home:false, info:false, qa: true})
        }
    }

    home() {
        return(
            <ScrollView style={styles.body}>  
            {/* {console.log("9034912380491238401830398")} */}
            {/* {console.log(this.state.lawyer.LawyerFields[0].Category_ID)}  */}
            {/* {console.log(this.state.lawyer['User']['birth'])} */}
            {/* home info */}
            <View >
                <View style={{alignItems:"center"}}>
                    <Text style={styles.home_info_name}>{this.state.lawyer.User.name} 변호사</Text>
                    <View style={{flexDirection:"row"}}>
                        {this.state.lawyer.LawyerFields.map((f, idx)=>{
                            return(
                            <Text key = {idx} style={styles.home_info_field}>#{categories[f.Category_ID]}</Text>
                            )
                        })}
                    </View>
                    <Text  style={styles.home_info_team}>{this.state.lawyer.companyName!=null? this.state.lawyer.companyName : "등록 된 소속 사무소가 없습니다."}</Text>
                    <Text style={styles.home_info_address}>{this.state.lawyer.address1!=null ? this.state.lawyer.address1 : "등록 된 주소가 없습니다."}</Text>
                </View>

                <View style={{margin:"6%"}}>
                    <View style={{flexDirection:"row", margin:"1%"}}>
                        <Text style={styles.home_info_subtitle}>분야</Text>
                        <View style={{flexDirection:"row"}}>
                            {this.state.lawyer.LawyerFields.map((f, id)=>{
                                return(
                                    <Text key = {id} style={styles.home_info_content}>{categories[f.Category_ID]} </Text>
                                )
                            })}
                        </View>
                    </View>
                    <View style={{flexDirection:"row", margin:"1%"}}>
                        <Text style={styles.home_info_subtitle}>경력</Text>
                        <Text style={styles.home_info_content}>{this.state.lawyer.Careers && this.state.lawyer.Careers.length ? this.state.lawyer.Careers[0].detail : empty}</Text>
                    </View>
                    <View style={{flexDirection:"row", margin:"1%"}}>
                        <Text style={styles.home_info_subtitle}>자격</Text>
                        <Text style={styles.home_info_content}>{this.state.lawyer.Qualifications && this.state.lawyer.Qualifications.length ? this.state.lawyer.Qualifications[0].detail : empty}</Text>
                    </View>
                    <View style={{flexDirection:"row", margin:"1%"}}>
                        <Text style={styles.home_info_subtitle}>학력</Text>
                        <Text style={styles.home_info_content}>{this.state.lawyer.Education && this.state.lawyer.Education.length ? this.state.lawyer.Education[0].detail : empty}</Text>
                    </View>
                </View>

                <View style={styles.moreButton}>
                    <TouchableOpacity>
                        <View style={{flexDirection: "row"}}>
                            <Text style={styles.moreButton_text}>변호사 정보 자세히 보기</Text>
                            <Image  source={require("../assets/lawyerMoreButton.png")} />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            {/* QA */}
            <View style={{marginVertical: "8%", marginHorizontal: "5%"}}>
                <Text style={styles.home_subtitle}>{this.state.lawyer.User.name} 변호사님의</Text>
                <View style={{flexDirection:"row"}}>
                    <Text style={styles.home_subtitle}>QA 답변</Text>
                    <Text style={styles.home_subtitle_num}>{this.state.answers.length}</Text>
                </View>

                <ScrollView style={{flexDirection:"row", marginVertical:"6%"}} showsHorizontalScrollIndicator={false} horizontal={true} >
                    {this.state.answers.map((q, id)=>{
                        return(
                            <View key = {id} style={styles.qa_question}>
                                <Text style={styles.qa_question_title} numberOfLines={2}>Q. {q.Question.title}</Text>
                                <Text style={styles.qa_question_content} numberOfLines={4}>A. {q.content}</Text>
                                <Text style={styles.qa_question_date}>{q.date}</Text>
                            </View>
                        )
                    })}
                    
                </ScrollView>
                <View style={styles.moreButton}>
                    <TouchableOpacity>
                        <View style={{flexDirection: "row"}}>
                            <Text style={styles.moreButton_text}>QA 답변 전체보기</Text>
                            <Image  source={require("../assets/lawyerMoreButton.png")} />
                        </View>
                    </TouchableOpacity>
                </View>

            </View>


        </ScrollView>
        )
    }

    info() {
        return(
            <ScrollView style={styles.body}>    
                {/* home info */}
                <View >
                    <View style={{alignItems:"center"}}>
                        <Text style={styles.home_info_name}>{this.state.lawyer.User.name} 변호사</Text>
                        <View style={{flexDirection:"row"}}>
                            {this.state.lawyer.LawyerFields.map((f, id)=>{
                                return(
                                <Text key = {id} style={styles.home_info_field}>#{categories[f.Category_ID]}</Text>
                                )
                            })}
                            
                        </View>
                        <Text  style={styles.home_info_team}>소개말</Text>
                        <Text style={styles.home_info_address}>{this.state.lawyer.introduction!=null ? this.state.lawyer.introduction : "등록 된 소개말이 없습니다."}</Text>
                    </View>
                </View>
                
                <View style={styles.thinUnderline}/>

                <View style={{marginHorizontal:"5%"}}>
                    <Text style={styles.info_subtitle}>주요분야</Text>
                    <View style={{flexDirection: "row"}}>
                        {this.state.lawyer.LawyerFields.map((f, id)=> {
                            return(
                                <View key = {id}style={{alignItems: 'center', marginRight:40, marginTop: 10}}>
                                    <Image style={styles.info_field_img} source={catImgList[f.Category_ID]}/>
                                    <Text style={styles.info_field_text}>{categories[f.Category_ID]}</Text>
                                </View>
                            )
                        })}
                        {/* {field.map((f)=> {
                            return(
                                <View style={{alignItems: 'center', marginRight:40, marginTop: 10}}>
                                    <Image style={styles.info_field_img} source={f.img}/>
                                    <Text style={styles.info_field_text}>{f.name}</Text>
                                </View>
                            )
                        })} */}
                    </View>
                </View>

                <View style={styles.thinUnderline}/>


                <View style={{marginHorizontal:"5%"}}>
                    <Text style={styles.info_subtitle}>이력사항</Text>
                    <View style={{margin:"3%"}}>
                        <Text style={styles.info_career_subtitle}>경력</Text>
                        <View style={{borderLeftColor:"#9C9A9A", borderLeftWidth: 1.5, margin: "3%", paddingHorizontal:"5%"}}>
                                {this.state.lawyer.Careers && this.state.lawyer.Careers.length ? this.state.lawyer.Careers.map((c, id)=>{
                                    return(
                                        <View key = {id} style={{flexDirection:"row"}}>
                                            <Text style={styles.info_career_text1}>{c.startYear} ~ {c.endYear===null ? empty : c.endYear}</Text>
                                            <Text  numberOfLines={1} style={styles.info_career_text2}>  -  {c.detail}</Text>   
                                        </View>
                                    )
                                }) : <Text>경력사항 없음</Text>}
                        </View>
                    </View>

                    <View style={{margin:"3%"}}>
                        <Text style={styles.info_career_subtitle}>자격</Text>
                        <View style={{borderLeftColor:"#9C9A9A", borderLeftWidth: 1.5, margin: "3%", paddingHorizontal:"5%"}}>
                            {this.state.lawyer.Qualifications && this.state.lawyer.Qualifications.length ? this.state.lawyer.Qualifications.map((c, id)=>{
                                    return(
                                        <View key = {id} style={{flexDirection:"row"}}>
                                            <Text style={styles.info_career_text1}>{c.startYear} ~ {c.endYear===null ? empty : c.endYear}</Text>
                                            <Text numberOfLines={1} style={styles.info_career_text2}>  -  {c.detail}</Text>   
                                        </View>
                                    )
                                }) : <Text>자격사항 없음</Text>}
                    
                        </View>
                    </View>
                    <View style={{margin:"3%"}}>
                        <Text style={styles.info_career_subtitle}>학력</Text>
                        <View style={{borderLeftColor:"#9C9A9A", borderLeftWidth: 1.5, margin: "3%", paddingHorizontal:"5%"}}>
                                {this.state.lawyer.Education && this.state.lawyer.Education.length ? this.state.lawyer.Education.map((c, id)=>{
                                    return(
                                        <View key = {id} style={{flexDirection:"row"}}>
                                            <Text style={styles.info_career_text1}>{c.startYear} ~ {c.endYear===null ? empty : c.endYear}</Text>
                                            <Text numberOfLines={1}  style={styles.info_career_text2}>  -  {c.detail}</Text>   
                                        </View>
                                    )
                                }) : <Text>학력사항 없음</Text>}
                        </View>
                    </View>
                    
                </View>
                <View style={styles.thinUnderline}/>
                

                <View>
                    <Text style={styles.info_subtitle}>활동사항</Text>
                    <View style={{margin:"3%"}}>
                    <View style={{borderLeftColor:"#9C9A9A", borderLeftWidth: 1.5, margin: "3%", paddingHorizontal:"5%"}}>
                                {this.state.lawyer.Activities && this.state.lawyer.Activities.length ? this.state.lawyer.Activities.map((c, idx)=>{
                                    return(
                                        <View style={{marginBottom:10}} key={idx}>
                                            <Text numberOfLines={1} style={styles.activity_text1}>{c.detail}</Text>
                                            <View style={{flexDirection:"row"}}>
                                            <Text  numberOfLines={2} style={styles.activity_text2}>   {c.url}</Text>   
                                            <TouchableOpacity onPress={()=>this.activityDelete(c, idx)}>
                                                <Text style={{color:colors.primary, fontFamily:"KPWDBold",alignSelf:"center", fontSize:11}}>삭제</Text>
                                            </TouchableOpacity>
                                        </View>
                                        </View>
                                    )
                                }) : <View>
                                
                                <Text>활동사항 없음</Text>
                               
                            </View>}
                        </View>
                    </View>
                </View>
                <View style={styles.thinUnderline}/>
                <View>
                    <Text style={styles.info_subtitle}>사무실 정보</Text>
                    <View style={{marginHorizontal:"5%"}}>


                            <Text style={styles.home_info_team}>{this.state.lawyer.companyName!=null?this.state.lawyer.companyName : "등록 된 소속 사무소가 없습니다." }</Text>
                            {/* <Text style={styles.home_info_address}>{lawyer.address}</Text> */}
                    <Text style={styles.home_info_address}>{this.state.lawyer.address1!=null ? this.state.lawyer.address1 : "등록 된 주소가 없습니다."}</Text>

                    </View>
                </View>

                <View style={styles.thinUnderline}/>

                <View style={styles.moreButton}>
                    <TouchableOpacity onPress={()=>this.props.navigation.navigate('LawyerModify', {lawyer: this.state.lawyer, id: this.state.id})}>
                        <View style={{flexDirection: "row", marginBottom:"5%"}}>
                            <Text style={styles.moreButton_text}>변호사 정보 수정 하기</Text>
                            <Image  source={require("../assets/lawyerMoreButton.png")} />
                        </View>
                    </TouchableOpacity>
                </View>




            </ScrollView>
        )
    }

    qa() {
        return(
            <ScrollView style={styles.body}>

                {this.state.answers.length>0 ? this.state.answers.map((q, idx)=>{
                    return(
                        <View style={{marginHorizontal:"5%"}} key={idx}>
                            <TouchableOpacity onPress={()=>this.props.navigation.navigate('QaAnswer', {post:q})}>
                                <View>
                                    <View style={styles.qa_detail_field}>
                                        {q.Question.Question_has_Categories.map((f, idx)=> {
                                            return(
                                                <Text style={styles.qa_detail_field_text} key={idx}>{categories[f.Category_ID]}</Text>
                                            )
                                        })}
                                        </View>
                                    <Text numberOfLines={2} style={styles.qa_detail_title}>{q.Question.title}</Text>
                                    {/* {console.log(q.Question.writtenDate.substring(0,2))} */}
                                    <Text style={styles.qa_question_date}>{q.Question.writtenDate.substring(0,10)}</Text>                            
                                </View>
                            </TouchableOpacity>
                            <View style={styles.thinShortUnderline}/>
                        </View>

                    )
                }) : <Text style={{alignSelf: "center"}}>등록 된 답변이 없습니다.</Text>}

            </ScrollView>
            
        )
    }

  

  render() {
    if (!this.state.fontsLoaded || Object.keys(this.state.lawyer).length === 0) {
      return <View />;
    }

    return (
      <View style={styles.container}>
        <Header2 {...this.props}/>
        <View >
            <ImageBackground style={styles.backgroundPic} source={{ uri: `${this.state.lawyer.User.photo}?random=${new Date()}` }}>
                <Text style={styles.backgroundPicText}>{this.state.lawyer.introduction}</Text>
            </ImageBackground>
        </View>
        <View style={styles.fieldTab}>
            <TouchableOpacity onPress={()=>this.handleTabs("home")}>
                <Text style={this.state.home ? styles.fieldTabText_selected : styles.fieldTabText}>홈</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>this.handleTabs("info")}>
                <Text style={this.state.info ? styles.fieldTabText_selected : styles.fieldTabText}>변호사정보</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>this.handleTabs("qa")}>
                <Text style={this.state.qa ? styles.fieldTabText_selected : styles.fieldTabText}>QA답변</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.underline}/>


        {this.state.home ? this.home() : null}
        {this.state.info ? this.info() : null}
        {this.state.qa ? this.qa() : null}


      </View>
    );
  }
}
Lawyer.contextType = MyContext;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Platform.OS === `ios` ? 0 : Constants.statusBarHeight,
        backgroundColor: "#fff",
    },
    body: {
        flex: 1,
        overflow: "scroll",
        paddingLeft:"5%",
        paddingRight:"5%",
        // backgroundColor: "#c0c0c0"
      },
      backgroundPic: {
        //   resizeMode: "contain",
        //   width: "100%",
          height: 200
      },
      backgroundPicText: {
        position: "absolute",
        bottom: 0,
        left: 0,
        color: "white",
        fontSize: 25,
        fontFamily: "KPWDBold",
        margin:"3%",
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 10,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
      },
      fieldTab: {
          flexDirection: "row",
          justifyContent: "space-between",
          marginVertical: "3%",
          marginHorizontal: "10%"
      },
      fieldTabText_selected: {
        fontFamily: "KPWDBold",
        fontSize: 13,
        color: "black"
      },
      fieldTabText: {
        fontFamily: "KPWDBold",
        fontSize: 13,
        color: "#878686"
      },


    underline : {
        width: 300,
        height: 3,
        backgroundColor: "#E7E7E7",
        alignSelf: "center",
        borderRadius: 10,
        marginBottom: "5%"
    },

    thinUnderline : {
        width: 500,
        height: 1,
        backgroundColor: "#E7E7E7",
        alignSelf: "center",
        borderRadius: 10,
        marginVertical: "8%"
    },
    thinShortUnderline : {
        width: 50,
        height: 2,
        backgroundColor: "#E7E7E7",
        alignSelf: "flex-start",
        borderRadius: 10,
        marginVertical: "5%"
    },



    home_info_name: {
        fontFamily: "KPBBold",
        fontSize: 20
    },

    home_info_field: {
        fontFamily: "KPWDMedium",
        fontSize: 13,
        color: "#5c5353",
        marginRight: 10
    },

    home_info_team: {
        marginTop: 10,
        fontFamily: "KPBBold",
        fontSize: 16,
    },
    home_info_address: {
        fontFamily: "KPWDMedium",
        fontSize: 13,
        color: "#5c5353",
        marginRight: 10
    },
    home_info_subtitle: {
        fontFamily: "KPBBold",
        fontSize: 14,
        marginRight: 10
    },
    home_info_content: {
        fontFamily: "KPBRegular",
        color:"#888282",
        fontSize: 13,

    },
    moreButton: {
        backgroundColor: "#f8f8f8",
        padding: "2%",
        alignItems: "center"
    },
    moreButton_text: {
        alignSelf: "center",
        color: "#888282",
        fontFamily: "KPBBold",
        fontSize: 13,
        marginRight: 5
    },

    home_subtitle: {
        fontFamily: "KPWDBold",
        fontSize: 20
    },

    home_subtitle_num: {
        fontFamily: "KPWDBold",
        fontSize: 20,
        marginLeft: 10,
        color: colors.primary
    },


    qa_question:{
        width: vw(40),
        marginRight: 20
    },
    qa_question_title: {
        fontFamily: "KPBRegular",
        fontSize: 13,
    },
    qa_question_content: {
        fontFamily: "KPWDMedium",
        fontSize: 13,
        color: "#858282",
        marginTop: 10
    },
    qa_question_date: {
        fontFamily: "KPWDMedium",
        fontSize: 10,
        color: "#755C5C",
        marginTop: 10
    },


    info_subtitle: {
        fontFamily: "KPWDBold",
        fontSize: 18
    },
    info_field_img: {
        width: 40,
        height: 40
    },
    info_field_text: {
        fontFamily: "KPWDBold",
        fontSize: 12,
        marginTop: 10
    },
    info_career_subtitle: {
        fontFamily: "KPWDBold",
        fontSize: 13,
        width:"90%",
    },
    info_career_text1: {
        fontFamily: "KPWDMedium",
        fontSize: 12,
        color: "#565252",
        marginVertical: 3,
        width:"30%"
    },
    info_career_text2: {
        fontFamily: "KPWDMedium",
        fontSize: 12,
        color: "#565252",
        marginVertical: 3,
        width:"70%"
    },

    activity_text1: {
        fontFamily: "KPWDMedium",
        fontSize: 15,
        color: "black",
        marginVertical: 3,
        width:"30%"
    },
    activity_text2: {
        fontFamily: "KPWDMedium",
        fontSize: 10,
        color: "#565252",
        marginVertical: 3,
        width:"92%"
    },

    // info_career_subtitle: {
    //     fontFamily: "KPWDBold",
    //     fontSize: 13
    // },
    // info_career_text: {
    //     fontFamily: "KPWDMedium",
    //     fontSize: 12,
    //     color: "#565252",
    //     marginVertical: 3
    // },

    qa_detail_title: {
        fontSize: 15,
        fontFamily: "KPWDBold"
    },

    qa_detail_field: {
        flexDirection: "row",
        // backgroundColor: "red", 
        marginTop: "5%",
        marginBottom:"1%"
    },

    qa_detail_field_text: {
        color: "gray",
        marginRight: "5%",
        fontSize: 10,
    },
    
    


});
