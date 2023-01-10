---
layout: post
title: "The Rise of Google Search"
date: 2023-01-10 01:00:16 -0000
author: Laasya Aki
tags: TeachTech math technology
---
![](https://img1.wsimg.com/isteam/ip/256c2eac-6fce-4fa6-8cc2-cb0858d3cc58/Internet_map_4096.png/:/cr=t:0%25,l:0%25,w:100%25,h:100%25/rs=w:1280)

[Hub (network science) - Wikipedia](https://en.wikipedia.org/wiki/Hub_(network_science))

Google Search is the most used search engine with over 92% of the search engine market share worldwide. Created by Larry Page and Sergey Brin in 1998, the search engine gained popularity due to the fact that it displayed desirable results first, unlike its competitors, where one might have had to scroll through unrelated pages that contained the same keywords as their query. But Google’s search result organization didn’t happen by pure luck or coincidence. Behind the scenes, the PageRank algorithm was hard at work, delivering apt results to the tool’s users. 

The PageRank algorithm was inspired by citation analysis, the examination of the importance of a document based on the number of times it was cited and how many citations of other works the document contained. Created by Eugene Garfeild in the 1950s, citation analysis is an application of link analysis, a method of data analysis used to evaluate connections between objects in network theory. 

Almost every website has at least one hyperlink leading to another page and some have hyperlinks from other pages leading to the website. The number of hyperlinks leading to a webpage and the number of hyperlinks on the webpage that lead to other sites determine a webpage’s importance. The importance, or rank, of a webpage can be determined by the function below.

![](https://img1.wsimg.com/isteam/ip/256c2eac-6fce-4fa6-8cc2-cb0858d3cc58/Screen%20Shot%202021-08-08%20at%2011.18.53%20PM.png/:/rs=w:1280)

[The PageRank Value for u - Wikipedia](https://en.wikipedia.org/wiki/PageRank)

Let “u” be any arbitrary page, the PageRank of that page. PR(u), can be determined first, by computing the PageRank of every “v”, PR(v), in the set Bu, where Bu refers to the set of all web pages that contain a direct hyperlink leading to page u. Then, dividing PR(v) by L(v), the total number of links on the specific site v, repeating this process for every site containing a hyperlink to u, and totaling the values, the PageRank of the webpage u is finally determined. This process is repeated for every public access webpage. Compiling the data of all the different webpages gives a table of considerable size, listing the importance of each page. The ranks and connections of different pages can also be shown through a web graph, a graph that describes hyperlinks between websites on the web.

![](https://img1.wsimg.com/isteam/ip/256c2eac-6fce-4fa6-8cc2-cb0858d3cc58/strong.png/:/cr=t:0%25,l:0%25,w:100%25,h:100%25/rs=w:1280)

[Web Graph - Ib Computer Science](https://ibcomputerscience.xyz/lesson-web-general/)

Each node or vertex, the circle, represents a webpage in this case and each edge, the arrow, represents what sites each webpage contains a hyperlink to. Each arrow shows a relation between two different websites. For example, page A contains hyperlinks to B and D, assigning half of its importance to the former and half to the latter. But, webgraphs usually describe the relationships between hundreds of thousands of websites or even millions of websites.

Even though new technologies and mathematical concepts have arisen in the last 20 years, the PageRank algorithm is still one of the most predominant factors in ordering search results. The use of eigenvectors and eigenvalues sets the algorithm and Google Search apart from its competitors. Eigenvalues can be used to describe the variance in data and how spread out it is. Their vector counterparts can be used to determine direction. Each eigenvector has an eigenvalue meaning that each pair corresponds to a webpage and ranking how important it is. Developed by Joseph-Louis Lagrange in the 18th century, eigenvectors and eigenvalues have been used to prove and solve countless problems. The simplicity of using vectors and coefficients to bring order to the chaos we call the internet has worked for more than twenty years. Google Search decided to develop a way to organize their results first, which has helped them become the most used search engine today.

-------------
~ Edited by Christian Mueth


References:

1. https://en.wikipedia.org/wiki/PageRank
2. https://www.rose-hulman.edu/~bryan/googleFinalVersionFixed.pdf
3. https://web.stanford.edu/class/cs54n/handouts/24-GooglePageRankAlgorithm.pdf 
4. https://nlp.stanford.edu/IR-book/html/htmledition/the-web-graph-1.html 
5. https://gs.statcounter.com/search-engine-market-share/desktop/worldwide
6. https://en.wikipedia.org/wiki/Webgraph
7. https://about.google/our-story/ 
8. https://www.whydomath.org/node/google/math.html 
9. https://en.wikipedia.org/wiki/Link_analysis
10. https://en.wikipedia.org/wiki/Network_theory
11. https://en.wikipedia.org/wiki/Eugene_Garfield
12. https://en.wikipedia.org/wiki/Hub_(network_science)
13. https://ibcomputerscience.xyz/lesson-web-general/
