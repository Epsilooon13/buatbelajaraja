(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.QuizCurriculum=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const modules=[
  {
    "id": "1",
    "title": "Examining Cisco Enterprise Network Architecture",
    "children": [
      {
        "id": "1.1",
        "title": "Introduction"
      },
      {
        "id": "1.2",
        "title": "Cisco Enterprise Architecture Model"
      },
      {
        "id": "1.3",
        "title": "Campus LAN Design Fundamentals"
      },
      {
        "id": "1.4",
        "title": "Traditional Multilayer Campus Layer Design"
      },
      {
        "id": "1.5",
        "title": "Campus Distribution Layer Design"
      },
      {
        "id": "1.6",
        "title": "Fabric and Cloud Enterprise Design"
      }
    ]
  },
  {
    "id": "2",
    "title": "Cisco Switching Paths",
    "children": [
      {
        "id": "2.1",
        "title": "Introduction"
      },
      {
        "id": "2.2",
        "title": "Layer 2 Switch Operation"
      },
      {
        "id": "2.3",
        "title": "Investigate the CAM"
      },
      {
        "id": "2.4",
        "title": "Control Plane and Data Plane"
      },
      {
        "id": "2.5",
        "title": "Cisco Switching Mechanisms"
      },
      {
        "id": "2.6",
        "title": "Cisco Express Forwarding Overview"
      },
      {
        "id": "2.7",
        "title": "Analyze Cisco Express Forwarding"
      }
    ]
  },
  {
    "id": "3",
    "title": "Implementing Campus LAN Connectivity",
    "children": [
      {
        "id": "3.1",
        "title": "Introduction"
      },
      {
        "id": "3.2",
        "title": "Creating a VLAN"
      },
      {
        "id": "3.3",
        "title": "IEEE 802.1Q"
      },
      {
        "id": "3.4",
        "title": "Troubleshoot VLAN and Trunk Issues"
      },
      {
        "id": "3.5",
        "title": "Inter-VLAN Routing"
      }
    ]
  },
  {
    "id": "4",
    "title": "Building Redundant Switched Topology",
    "children": [
      {
        "id": "4.1",
        "title": "Introduction"
      },
      {
        "id": "4.2",
        "title": "STP Overview"
      },
      {
        "id": "4.3",
        "title": "STP Operation"
      },
      {
        "id": "4.4",
        "title": "STP Types and Features"
      },
      {
        "id": "4.5",
        "title": "Tune STP and Configure RSTP"
      },
      {
        "id": "4.6",
        "title": "Introducing MST"
      },
      {
        "id": "4.7",
        "title": "Configure Multiple STP"
      },
      {
        "id": "4.8",
        "title": "PortFast and BPDU Guard"
      },
      {
        "id": "4.9",
        "title": "Enhance STP with Root Guard"
      }
    ]
  },
  {
    "id": "5",
    "title": "Implementing Network Redundancy",
    "children": [
      {
        "id": "5.1",
        "title": "Introduction"
      },
      {
        "id": "5.2",
        "title": "Need for Default Gateway Redundancy"
      },
      {
        "id": "5.3",
        "title": "Define FHRP"
      },
      {
        "id": "5.4",
        "title": "Implement HSRP"
      },
      {
        "id": "5.5",
        "title": "HSRP Advanced Features"
      },
      {
        "id": "5.6",
        "title": "Configure VRRP"
      },
      {
        "id": "5.7",
        "title": "Cisco Switch High Availability Features"
      }
    ]
  },
  {
    "id": "6",
    "title": "Implementing Layer 2 Port Aggregation",
    "children": [
      {
        "id": "6.1",
        "title": "Introduction"
      },
      {
        "id": "6.2",
        "title": "Need for EtherChannel"
      },
      {
        "id": "6.3",
        "title": "EtherChannel Mode Interactions"
      },
      {
        "id": "6.4",
        "title": "Layer 2 EtherChannel Configuration Guidelines"
      },
      {
        "id": "6.5",
        "title": "EtherChannel Load-Balancing Options"
      },
      {
        "id": "6.6",
        "title": "Troubleshoot EtherChannel Issues"
      },
      {
        "id": "6.7",
        "title": "Troubleshoot EtherChannel"
      },
      {
        "id": "6.8",
        "title": "Describe Policy-Based Routing"
      }
    ]
  },
  {
    "id": "7",
    "title": "Introducing QoS",
    "children": [
      {
        "id": "7.1",
        "title": "Introduction"
      },
      {
        "id": "7.2",
        "title": "Understand the Impact of User Applications on the Network"
      },
      {
        "id": "7.3",
        "title": "Need for QoS"
      },
      {
        "id": "7.4",
        "title": "Describe QoS Mechanisms"
      },
      {
        "id": "7.5",
        "title": "Define and Interpret a QoS Policy"
      }
    ]
  },
  {
    "id": "8",
    "title": "Explaining EIGRP",
    "children": [
      {
        "id": "8.1",
        "title": "Introduction"
      },
      {
        "id": "8.2",
        "title": "EIGRP Features"
      },
      {
        "id": "8.3",
        "title": "EIGRP Reliable Transport"
      },
      {
        "id": "8.4",
        "title": "Establishing EIGRP Neighbor Adjacency"
      },
      {
        "id": "8.5",
        "title": "EIGRP Metrics"
      },
      {
        "id": "8.6",
        "title": "EIGRP Path Selection"
      },
      {
        "id": "8.7",
        "title": "Explore EIGRP Load Balancing and Sharing"
      },
      {
        "id": "8.8",
        "title": "EIGRP for IPv6"
      },
      {
        "id": "8.9",
        "title": "Compare EIGRP and OSPF Routing Protocols"
      },
      {
        "id": "8.10",
        "title": "Configure EIGRP"
      }
    ]
  },
  {
    "id": "9",
    "title": "Implementing OSPF",
    "children": [
      {
        "id": "9.1",
        "title": "Introduction"
      },
      {
        "id": "9.2",
        "title": "Describe OSPF"
      },
      {
        "id": "9.3",
        "title": "OSPF Process"
      },
      {
        "id": "9.4",
        "title": "OSPF Neighbor Adjacencies"
      },
      {
        "id": "9.5",
        "title": "Building a Link-State Database"
      },
      {
        "id": "9.6",
        "title": "OSPF LSA Types"
      },
      {
        "id": "9.7",
        "title": "Compare Single-Area and Multiarea OSPF"
      },
      {
        "id": "9.8",
        "title": "OSPF Area Structure"
      },
      {
        "id": "9.9",
        "title": "OSPF Network Types"
      },
      {
        "id": "9.10",
        "title": "Implement Multiarea OSPF"
      }
    ]
  },
  {
    "id": "10",
    "title": "Optimizing OSPF",
    "children": [
      {
        "id": "10.1",
        "title": "Introduction"
      },
      {
        "id": "10.2",
        "title": "OSPF Cost"
      },
      {
        "id": "10.3",
        "title": "Implement OSPF Tuning"
      },
      {
        "id": "10.4",
        "title": "OSPF Route Summarization"
      },
      {
        "id": "10.5",
        "title": "OSPF Route Filtering Tools"
      },
      {
        "id": "10.6",
        "title": "Apply OSPF Optimization"
      },
      {
        "id": "10.7",
        "title": "Compare OSPFv2 and OSPFv3"
      },
      {
        "id": "10.8",
        "title": "Implement OSPFv3"
      }
    ]
  },
  {
    "id": "11",
    "title": "Exploring EBGP",
    "children": [
      {
        "id": "11.1",
        "title": "Introduction"
      },
      {
        "id": "11.2",
        "title": "Interdomain Routing with BGP"
      },
      {
        "id": "11.3",
        "title": "BGP Operations"
      },
      {
        "id": "11.4",
        "title": "Types of BGP Neighbor Relationships"
      },
      {
        "id": "11.5",
        "title": "BGP Path Selection"
      },
      {
        "id": "11.6",
        "title": "BGP Path Attributes"
      },
      {
        "id": "11.7",
        "title": "Configure and Verify Single-Homed EBGP"
      }
    ]
  },
  {
    "id": "12",
    "title": "Introducing Multicast Protocols",
    "children": [
      {
        "id": "12.1",
        "title": "Introduction"
      },
      {
        "id": "12.2",
        "title": "Multicast Overview"
      },
      {
        "id": "12.3",
        "title": "Internet Group Management Protocol"
      },
      {
        "id": "12.4",
        "title": "Multicast Distribution Trees"
      },
      {
        "id": "12.5",
        "title": "IP Multicast Routing"
      },
      {
        "id": "12.6",
        "title": "Rendezvous Point"
      }
    ]
  },
  {
    "id": "13",
    "title": "Implementing NAT",
    "children": [
      {
        "id": "13.1",
        "title": "Introduction"
      },
      {
        "id": "13.2",
        "title": "Define NAT"
      },
      {
        "id": "13.3",
        "title": "NAT Address Types"
      },
      {
        "id": "13.4",
        "title": "Explore NAT Implementations"
      },
      {
        "id": "13.5",
        "title": "NAT Virtual Interface"
      },
      {
        "id": "13.6",
        "title": "Implement NAT"
      }
    ]
  },
  {
    "id": "14",
    "title": "Implementing Infrastructure Security",
    "children": [
      {
        "id": "14.1",
        "title": "Introduction"
      },
      {
        "id": "14.2",
        "title": "Types of ACLs"
      },
      {
        "id": "14.3",
        "title": "Configure Numbered Access Lists"
      },
      {
        "id": "14.4",
        "title": "Use ACLs to Filter Network Traffic"
      },
      {
        "id": "14.5",
        "title": "Apply ACLs to Interfaces"
      },
      {
        "id": "14.6",
        "title": "Configure Named Access Lists"
      },
      {
        "id": "14.7",
        "title": "Configure Standard and Extended ACLs"
      },
      {
        "id": "14.8",
        "title": "Control Plane Overview"
      },
      {
        "id": "14.9",
        "title": "Control Plane Policing"
      },
      {
        "id": "14.10",
        "title": "Configure Control Plane Policing"
      }
    ]
  },
  {
    "id": "15",
    "title": "Exploring Enterprise Network Security Architecture",
    "children": [
      {
        "id": "15.1",
        "title": "Introduction"
      },
      {
        "id": "15.2",
        "title": "Explore the Threatscape"
      },
      {
        "id": "15.3",
        "title": "Cisco Intrusion Prevention System"
      },
      {
        "id": "15.4",
        "title": "Virtual Private Networks"
      },
      {
        "id": "15.5",
        "title": "Content Security"
      },
      {
        "id": "15.6",
        "title": "Logging"
      },
      {
        "id": "15.7",
        "title": "Endpoint Security"
      },
      {
        "id": "15.8",
        "title": "Personal Firewalls"
      },
      {
        "id": "15.9",
        "title": "Antivirus and Antispyware"
      },
      {
        "id": "15.10",
        "title": "Centralized Endpoint Policy Enforcement"
      },
      {
        "id": "15.11",
        "title": "Cisco AMP for Endpoints"
      },
      {
        "id": "15.12",
        "title": "Firewall Concepts"
      },
      {
        "id": "15.13",
        "title": "TrustSec"
      },
      {
        "id": "15.14",
        "title": "MAC Security"
      },
      {
        "id": "15.15",
        "title": "Identity Management"
      },
      {
        "id": "15.16",
        "title": "802.1X for Wired and Wireless Endpoint Authentication"
      },
      {
        "id": "15.17",
        "title": "MAC Authentication Bypass"
      },
      {
        "id": "15.18",
        "title": "Web Authentication"
      }
    ]
  },
  {
    "id": "16",
    "title": "Implementing Secure Access Control",
    "children": [
      {
        "id": "16.1",
        "title": "Introduction"
      },
      {
        "id": "16.2",
        "title": "Securing Device Access"
      },
      {
        "id": "16.3",
        "title": "AAA Framework Overview"
      },
      {
        "id": "16.4",
        "title": "Benefits of AAA Usage"
      },
      {
        "id": "16.5",
        "title": "Authentication Options"
      },
      {
        "id": "16.6",
        "title": "RADIUS and TACACS+"
      },
      {
        "id": "16.7",
        "title": "Enabling AAA and Configuring a Local User for Fallback"
      },
      {
        "id": "16.8",
        "title": "Configuring RADIUS for Console and vty Access"
      },
      {
        "id": "16.9",
        "title": "Configuring TACACS+ for Console and vty Access"
      },
      {
        "id": "16.10",
        "title": "Configure Authorization and Accounting"
      },
      {
        "id": "16.11",
        "title": "Implement Local and Server-Based AAA"
      }
    ]
  },
  {
    "id": "17",
    "title": "Introducing Virtualization Protocols and Techniques",
    "children": [
      {
        "id": "17.1",
        "title": "Introduction"
      },
      {
        "id": "17.2",
        "title": "Server Virtualization"
      },
      {
        "id": "17.3",
        "title": "Need for Network Virtualization"
      },
      {
        "id": "17.4",
        "title": "Path Isolation Overview"
      },
      {
        "id": "17.5",
        "title": "Introducing VRF"
      },
      {
        "id": "17.6",
        "title": "Configure and Verify VRF"
      },
      {
        "id": "17.7",
        "title": "Introducing Generic Routing Encapsulation"
      },
      {
        "id": "17.8",
        "title": "Configure and Verify a GRE Tunnel"
      }
    ]
  },
  {
    "id": "18",
    "title": "Exploring Virtual Private Networks and Interfaces",
    "children": [
      {
        "id": "18.1",
        "title": "Introduction"
      },
      {
        "id": "18.2",
        "title": "Site-to-Site VPN Technologies"
      },
      {
        "id": "18.3",
        "title": "IPsec VPN Overview"
      },
      {
        "id": "18.4",
        "title": "IPsec: Internet Key Exchange"
      },
      {
        "id": "18.5",
        "title": "IPsec Modes"
      },
      {
        "id": "18.6",
        "title": "IPsec VPN Types"
      },
      {
        "id": "18.7",
        "title": "Cisco IOS VTI"
      },
      {
        "id": "18.8",
        "title": "Configure Static VTI Point-to-Point Tunnels"
      }
    ]
  },
  {
    "id": "19",
    "title": "Implementing Network Services",
    "children": [
      {
        "id": "19.1",
        "title": "Introduction"
      },
      {
        "id": "19.2",
        "title": "Understanding NTP"
      },
      {
        "id": "19.3",
        "title": "Describe PTP"
      },
      {
        "id": "19.4",
        "title": "Logging Services"
      },
      {
        "id": "19.5",
        "title": "Configure Syslog"
      },
      {
        "id": "19.6",
        "title": "Understanding SNMP"
      },
      {
        "id": "19.7",
        "title": "Introducing NetFlow"
      },
      {
        "id": "19.8",
        "title": "Configure and Verify Flexible NetFlow"
      },
      {
        "id": "19.9",
        "title": "Understanding Cisco IOS EEM"
      },
      {
        "id": "19.10",
        "title": "Configure Cisco IOS EEM"
      }
    ]
  },
  {
    "id": "20",
    "title": "Using Network Analysis Tools",
    "children": [
      {
        "id": "20.1",
        "title": "Introduction"
      },
      {
        "id": "20.2",
        "title": "Troubleshooting Concepts"
      },
      {
        "id": "20.3",
        "title": "Network Troubleshooting Procedures: Overview"
      },
      {
        "id": "20.4",
        "title": "Network Troubleshooting Procedures: Case Study"
      },
      {
        "id": "20.5",
        "title": "Basic Hardware Diagnostics"
      },
      {
        "id": "20.6",
        "title": "Filtered Show Commands"
      },
      {
        "id": "20.7",
        "title": "Troubleshoot Connectivity and Analyze Traffic with Ping, Traceroute, and Debug"
      },
      {
        "id": "20.8",
        "title": "Cisco IOS IP SLAs"
      },
      {
        "id": "20.9",
        "title": "Configure and Verify Cisco IP SLAs"
      },
      {
        "id": "20.10",
        "title": "SPAN Overview"
      },
      {
        "id": "20.11",
        "title": "Remote SPAN"
      },
      {
        "id": "20.12",
        "title": "Encapsulated Remote Switched Port Analyzer"
      },
      {
        "id": "20.13",
        "title": "Cisco Packet Capture Tools Overview"
      }
    ]
  },
  {
    "id": "21",
    "title": "Discovering the Basics of Python Programming",
    "children": [
      {
        "id": "21.1",
        "title": "Introduction"
      },
      {
        "id": "21.2",
        "title": "Describe Python Concepts"
      },
      {
        "id": "21.3",
        "title": "String Data Types"
      },
      {
        "id": "21.4",
        "title": "Numbers Data Types"
      },
      {
        "id": "21.5",
        "title": "Boolean Data Types"
      },
      {
        "id": "21.6",
        "title": "Script Writing and Execution"
      },
      {
        "id": "21.7",
        "title": "Analyzing the Code"
      },
      {
        "id": "21.8",
        "title": "Write and Troubleshoot Python Scripts"
      }
    ]
  },
  {
    "id": "22",
    "title": "Introducing Network Programmability Protocols",
    "children": [
      {
        "id": "22.1",
        "title": "Introduction"
      },
      {
        "id": "22.2",
        "title": "Configuration Management"
      },
      {
        "id": "22.3",
        "title": "Evolution of Device Management and Programmability"
      },
      {
        "id": "22.4",
        "title": "Data Encoding Formats"
      },
      {
        "id": "22.5",
        "title": "Understanding JSON"
      },
      {
        "id": "22.6",
        "title": "Explore JSON Objects and Scripts in Python"
      },
      {
        "id": "22.7",
        "title": "Model-Driven Programmability Stack"
      },
      {
        "id": "22.8",
        "title": "Introduction to YANG"
      },
      {
        "id": "22.9",
        "title": "Types of YANG Models"
      },
      {
        "id": "22.10",
        "title": "Understanding NETCONF"
      },
      {
        "id": "22.11",
        "title": "Explain NETCONF and YANG"
      },
      {
        "id": "22.12",
        "title": "Use NETCONF via SSH"
      },
      {
        "id": "22.13",
        "title": "Understanding REST"
      },
      {
        "id": "22.14",
        "title": "Understanding RESTCONF"
      },
      {
        "id": "22.15",
        "title": "Use RESTCONF with Cisco IOS XE Software"
      }
    ]
  },
  {
    "id": "23",
    "title": "Exploring Cisco DNA Center - Network Automation and Management",
    "children": [
      {
        "id": "23.1",
        "title": "Introduction"
      },
      {
        "id": "23.2",
        "title": "Cisco Catalyst Center Solution Overview"
      },
      {
        "id": "23.3",
        "title": "Cisco Catalyst Center—Functional Areas Overview"
      },
      {
        "id": "23.4",
        "title": "Cisco Catalyst Center—NetOps Overview"
      },
      {
        "id": "23.5",
        "title": "Cisco Catalyst Center—SecOps Overview"
      },
      {
        "id": "23.6",
        "title": "Cisco Catalyst Center—AIOps Overview"
      },
      {
        "id": "23.7",
        "title": "Cisco Catalyst Center—DevOps Overview"
      },
      {
        "id": "23.8",
        "title": "Cisco Catalyst Center Inventory Overview"
      },
      {
        "id": "23.9",
        "title": "Cisco Catalyst Center Configuration Management Overview"
      },
      {
        "id": "23.10",
        "title": "Onboarding of Network Devices Using Cisco Catalyst Center"
      },
      {
        "id": "23.11",
        "title": "Cisco Catalyst Center SWIM"
      },
      {
        "id": "23.12",
        "title": "Cisco Catalyst Center (Assurance) AIOps Key Features and Use Cases"
      },
      {
        "id": "23.13",
        "title": "Cisco Catalyst Center (Assurance) AIOps Implementation Workflow"
      }
    ]
  },
  {
    "id": "24",
    "title": "Examining the Cisco SD-Access Solution",
    "children": [
      {
        "id": "24.1",
        "title": "Introduction"
      },
      {
        "id": "24.2",
        "title": "Need for Cisco SD-Access"
      },
      {
        "id": "24.3",
        "title": "Cisco SD-Access Overview"
      },
      {
        "id": "24.4",
        "title": "Cisco SD-Access Fabric Components"
      },
      {
        "id": "24.5",
        "title": "Cisco SD-Access Fabric Control Plane Based on LISP"
      },
      {
        "id": "24.6",
        "title": "Cisco SD-Access Fabric Data Plane Based on VXLAN"
      },
      {
        "id": "24.7",
        "title": "Cisco SD-Access Fabric Policy Plane Based on Cisco TrustSec"
      },
      {
        "id": "24.8",
        "title": "Role of Cisco ISE and Cisco DNA Center in Cisco SD-Access"
      },
      {
        "id": "24.9",
        "title": "Cisco SD-Access Wireless Architecture"
      },
      {
        "id": "24.10",
        "title": "Traditional Campus Interoperating with Cisco SD-Access"
      }
    ]
  },
  {
    "id": "25",
    "title": "Exploring the Working Principles of the Cisco SD-WAN Solution",
    "children": [
      {
        "id": "25.1",
        "title": "Introduction"
      },
      {
        "id": "25.2",
        "title": "Need for Software-Defined Networking for WAN"
      },
      {
        "id": "25.3",
        "title": "Cisco Catalyst SD-WAN Components and Functions"
      },
      {
        "id": "25.4",
        "title": "Cisco Catalyst SD-WAN Orchestration Plane"
      },
      {
        "id": "25.5",
        "title": "Cisco Catalyst SD-WAN Management Plane"
      },
      {
        "id": "25.6",
        "title": "Cisco Catalyst SD-WAN Control Plane"
      },
      {
        "id": "25.7",
        "title": "Cisco Catalyst SD-WAN Data Plane"
      },
      {
        "id": "25.8",
        "title": "Cisco Catalyst SD-WAN Programmatic APIs"
      },
      {
        "id": "25.9",
        "title": "Cisco Catalyst SD-WAN Analytics"
      },
      {
        "id": "25.10",
        "title": "Cisco Catalyst SD-WAN Terminology"
      },
      {
        "id": "25.11",
        "title": "Cisco IOS XE and IOS XE SD-WAN Software"
      },
      {
        "id": "25.12",
        "title": "Flexible Controller Deployment Options"
      }
    ]
  },
  {
    "id": "26",
    "title": "Introducing APIs in Cisco DNA Center and vManage",
    "children": [
      {
        "id": "26.1",
        "title": "Introduction"
      },
      {
        "id": "26.2",
        "title": "Application Programming Interfaces"
      },
      {
        "id": "26.3",
        "title": "REST API Response Codes and Results"
      },
      {
        "id": "26.4",
        "title": "REST API Security"
      },
      {
        "id": "26.5",
        "title": "Cisco Catalyst Center APIs"
      },
      {
        "id": "26.6",
        "title": "Cisco Catalyst SD-WAN REST API Overview"
      }
    ]
  }
];

const normalize=value=>String(value).toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const aliases={
 'BGP · Weight':'11.5','BGP · Best Path':'11.5','BGP · MED':'11.5','BGP · Dasar':'11.3',
 'BGP Path Selection Overview':'11.5','BGP Route Selection Overview':'11.5',
 'BGP Route Selection Process':'11.5','BGP Path Attributes Explanation':'11.6',
 'BGP Neighbor Relationships':'11.4','EBGP Neighbor Relationships':'11.4',
 'BGP Message Types':'11.3','BGP Data Structures Summary':'11.3',
 'BGP Characteristics Summary':'11.3','BGP Path Vector Functionality':'11.3',
 'Interdomain Routing dengan BGP':'11.2','Exploring eBGP Basics':'11',
 'Fungsi Keepalive Hold Time BGP':'11.3','Penjelasan BGP TTL Security':'11.4',
 'Jelaskan BGP Origin Code':'11.6','Fungsi BGP Community':'11.6','BGP Routing Policies':'11.3',
 'Cisco Enterprise Architecture':'1.2','Desain Lapisan Kampus Tradisional':'1.4',
 'Campus Distribution Layer':'1.5','Desain Jaringan Cloud Fabric':'1.6'
};
const aliasMap=new Map(Object.entries(aliases).map(([key,value])=>[normalize(key),value]));
const subs=modules.flatMap(m=>m.children);
function resolve(category){
 const text=String(category).trim();
 const numbered=text.match(/^(?:(?:module|modul)\s+\d+\s*[-:|>]\s*)?(?:(?:submodule|submodul)\s+)?(\d+\.\d+)(?=\.|\s|$|[-:])/i);
 if(numbered&&subs.some(s=>s.id===numbered[1]))return {module:numbered[1].split('.')[0],submodule:numbered[1]};
 const norm=normalize(text), alias=aliasMap.get(norm);
 if(alias)return {module:alias.split('.')[0],submodule:alias.includes('.')?alias:''};
 const matches=subs.filter(s=>normalize(s.title)===norm||normalize(s.id+' '+s.title)===norm);
 if(matches.length===1)return {module:matches[0].id.split('.')[0],submodule:matches[0].id};
 const mod=modules.find(m=>normalize(m.title)===norm||normalize('Module '+m.id+' '+m.title)===norm);
 if(mod)return {module:mod.id,submodule:''};
 const id=text.match(/^(?:module|modul)\s+(\d+)(?=\s|$|[-:])/i);
 if(id&&modules.some(m=>m.id===id[1]))return {module:id[1],submodule:''};
 return {module:'other',submodule:''};
}
function filter(bank,moduleId='',submoduleId=''){
 return bank.filter(q=>{const match=resolve(q.category);return (!moduleId||match.module===moduleId)&&(!submoduleId||(moduleId==='other'?q.category===submoduleId:match.submodule===submoduleId));});
}
return {modules,resolve,filter};
});
