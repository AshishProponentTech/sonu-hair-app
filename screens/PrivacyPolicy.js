import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  PixelRatio,
} from "react-native";
// constants
import configResponse from "../config/constant";
import { Dimensions } from "react-native";
import { responsive } from "../helper/responsive";

export default function PrivacyPolicy() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollStyle}>
        <View style={styles.MasterView}>
          <Text style={styles.InnerText}>Privacy Policy</Text>
          <Text style={styles.MainContent}>Last updated February 23, 2020</Text>
          <Text style={styles.mainPara}>
            Sonuhaircut (“we” or “us” or “our”) respects the privacy of our
            users (“user” or “you”). This Privacy Policy explains how we
            collect, use, disclose, and safeguard your information when you
            visit our mobile application (the “Application”). Please read this
            Privacy Policy carefully. IF YOU DO NOT AGREE WITH THE TERMS OF THIS
            PRIVACY POLICY, PLEASE DO NOT ACCESS THE APPLICATION.
          </Text>
          <Text style={styles.mainPara}>
            We reserve the right to make changes to this Privacy Policy at any
            time and for any reason. We will alert you about any changes by
            updating the “Last updated” date of this Privacy Policy. You are
            encouraged to periodically review this Privacy Policy to stay
            informed of updates. You will be deemed to have been made aware of,
            will be subject to, and will be deemed to have accepted the changes
            in any revised Privacy Policy by your continued use of the
            Application after the date such revised Privacy Policy is posted.
          </Text>
          <Text style={styles.mainPara}>
            This Privacy Policy does not apply to the third-party online/mobile
            store from which you install the Application or make payments,
            including any in-game virtual items, which may also collect and use
            data about you. We are not responsible for any of the data collected
            by any such third party.
          </Text>
          <Text style={styles.head}>COLLECTION OF YOUR INFORMATION</Text>
          <Text style={styles.para}>
            We may collect information about you in a variety of ways. The
            information we may collect via the Application depends on the
            content and materials you use, and includes:
          </Text>
          <Text style={styles.subHead}>Personal Data</Text>
          <Text style={styles.para}>
            Demographic and other personally identifiable information (such as
            your name and email address) that you voluntarily give to us when
            choosing to participate in various activities related to the
            Application, such as chat, posting messages in comment sections or
            in our forums, liking posts, sending feedback, and responding to
            surveys. If you choose to share data about yourself via your
            profile, online chat, or other interactive areas of the Application,
            please be advised that all data you disclose in these areas is
            public and your data will be accessible to anyone who accesses the
            Application.
          </Text>
          <Text style={styles.subHead}>Derivative Data</Text>
          <Text style={styles.para}>
            Information our servers automatically collect when you access the
            Application, such as your native actions that are integral to the
            Application, including liking, re-blogging, or replying to a post,
            as well as other interactions with the Application and other users
            via server log files.
          </Text>
          <Text style={styles.subHead}>Facebook Permissions</Text>
          <Text style={styles.para}>
            The Application may by default access your Facebook basic account
            information, including your name, email, gender, birthday, current
            city, and profile picture URL, as well as other information that you
            choose to make public. We may also request access to other
            permissions related to your account, such as friends, checkins, and
            likes, and you may choose to grant or deny us access to each
            individual permission. For more information regarding Facebook
            permissions, refer to the Facebook Permissions Reference page.
          </Text>
          <Text style={styles.subHead}>Data from Social Networks </Text>
          <Text style={styles.para}>
            User information from social networking sites, such as social media
            sites that your mobile app connects to, including your name, your
            social network username, location, gender, birth date, email
            address, profile picture, and public data for contacts, if you
            connect your account to such social networks. This information may
            also include the contact information of anyone you invite to use
            and/or join the Application.
          </Text>
          <Text style={styles.subHead}>Geo-Location Information</Text>
          <Text style={styles.para}>
            We may request access or permission to and track location-based
            information from your mobile device, either continuously or while
            you are using the Application, to provide location-based services.
            If you wish to change our access or permissions, you may do so in
            your device’s settings.
          </Text>
          <Text style={styles.subHead}>Mobile Device Access</Text>
          <Text style={styles.para}>
            We may request access or permission to certain features from your
            mobile device, including your mobile device’s internet,external
            storage . If you wish to change our access or permissions, you may
            do so in your device’s settings.
          </Text>
          <Text style={styles.subHead}>Mobile Device Data</Text>
          <Text style={styles.para}>
            Device information such as your mobile device ID number, model, and
            manufacturer, version of your operating system, phone number,
            country, location, and any other data you choose to provide.
          </Text>
          <Text style={styles.subHead}>Push Notifications</Text>
          <Text style={styles.para}>
            We may request to send you push notifications regarding your account
            or the Application. If you wish to opt-out from receiving these
            types of communications, you may turn them off in your device’s
            settings.
          </Text>
          <Text style={styles.subHead}>Third-Party Data</Text>
          <Text style={styles.para}>
            Information from third parties, such as personal information or
            network friends, if you connect your account to the third party and
            grant the Application permission to access this information.
          </Text>
          <Text style={styles.head}>USE OF YOUR INFORMATION</Text>
          <Text style={styles.para}>
            Having accurate information about you permits us to provide you with
            a smooth, efficient, and customized experience. Specifically, we may
            use information collected about you via the Application to: [Choose
            from the options below, or add your own]
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// styleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollStyle: {
    height: "auto",
  },
  MasterView: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  InnerImage: {
    width: 50,
    height: 60,
    resizeMode: "contain",
  },
  InnerText: {
    fontSize: 20 * responsive(),
    color: configResponse.primaryColor,
    textAlign: "center",
    letterSpacing: 2,
    justifyContent: "center",
    marginBottom: 0,
    fontFamily: "Inter_700Bold",
    width: "100%",
  },
  mainPara: {
    fontSize: 14 * responsive(),
    lineHeight:
      18 *responsive(),
    color: "#333",
    lineHeight:
      20 *responsive(),
    textAlign: "left",
    marginTop: 10,
    fontFamily: configResponse.fontFamily,
  },
  MainContent: {
    fontSize: 12 * responsive(),
    color: "#000",
    lineHeight:
      15 *responsive(),
    marginBottom: 30,
    textAlign: "center",
    fontFamily: "Inter_400Regular",
    width: "100%",
  },
  head: {
    fontSize: 18 * responsive(),
    textAlign: "center",
    marginVertical: 20,
    fontWeight: "bold",
    fontFamily: configResponse.fontFamily,
  },
  subHead: {
    fontSize: 16 * responsive(),
    marginVertical: 20,
    fontWeight: "bold",
    fontFamily: configResponse.fontFamily,
  },
  para: {
    fontSize: 14 * responsive(),
    lineHeight:
      20 *responsive(),
    color: "#333",
    fontFamily: configResponse.fontFamily,
  },
});
